<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsAppService
{
    protected string $apiUrl;
    protected string $apiKey;
    protected array $recipientNumbers;

    public function __construct()
    {
        $this->apiUrl = config('services.whatsapp.api_url', '');
        $this->apiKey = config('services.whatsapp.api_key', '');
        $this->recipientNumbers = explode(',', config('services.whatsapp.recipient_numbers', '3740280,3569074'));
    }

    /**
     * Send order notification via WhatsApp
     */
    public function sendOrderNotification(Order $order): bool
    {
        $message = $this->formatOrderMessage($order);
        $success = true;

        foreach ($this->recipientNumbers as $number) {
            $number = trim($number);
            if (empty($number)) {
                continue;
            }

            try {
                $this->sendMessage($number, $message);
                Log::info("WhatsApp notification sent successfully to {$number} for order #{$order->order_number}");
            } catch (\Exception $e) {
                Log::error("Failed to send WhatsApp notification to {$number}: " . $e->getMessage());
                $success = false;
            }
        }

        return $success;
    }

    /**
     * Format order details into WhatsApp message
     */
    protected function formatOrderMessage(Order $order): string
    {
        $message = "🛒 *New Order Received*\n\n";
        $message .= "Order Number: *{$order->order_number}*\n";
        $message .= "Status: *{$order->status}*\n";
        $message .= "Total: *$" . number_format($order->total, 2) . "*\n\n";
        
        $message .= "*Customer Details:*\n";
        if (isset($order->shipping_address['name'])) {
            $message .= "Name: {$order->shipping_address['name']}\n";
        }
        if (isset($order->shipping_address['phone'])) {
            $message .= "Phone: {$order->shipping_address['phone']}\n";
        }
        if (isset($order->shipping_address['email'])) {
            $message .= "Email: {$order->shipping_address['email']}\n";
        }
        
        $message .= "\n*Shipping Address:*\n";
        if (isset($order->shipping_address['address'])) {
            $message .= "{$order->shipping_address['address']}\n";
        }
        if (isset($order->shipping_address['city'])) {
            $message .= "{$order->shipping_address['city']}";
        }
        if (isset($order->shipping_address['state'])) {
            $message .= ", {$order->shipping_address['state']}";
        }
        if (isset($order->shipping_address['postal_code'])) {
            $message .= " {$order->shipping_address['postal_code']}";
        }
        
        $message .= "\n\n*Order Items:*\n";
        foreach ($order->products as $product) {
            $quantity = $product->pivot->quantity;
            $price = $product->pivot->price;
            $message .= "• {$product->name} (Qty: {$quantity}) - $" . number_format($price * $quantity, 2) . "\n";
        }
        
        $message .= "\n*Payment:*\n";
        $message .= "Method: {$order->payment_method}\n";
        $message .= "Status: {$order->payment_status}\n";
        
        return $message;
    }

    /**
     * Send WhatsApp message using HTTP API
     */
    protected function sendMessage(string $to, string $message): void
    {
        $provider = config('services.whatsapp.provider', 'log');
        
        switch ($provider) {
            case 'twilio':
                $this->sendViaTwilio($to, $message);
                break;
            case 'meta':
                $this->sendViaMeta($to, $message);
                break;
            case 'http':
                $this->sendViaHttp($to, $message);
                break;
            default:
                // Fallback: Log the message (for development/testing)
                Log::info("WhatsApp Message (would send to {$to}):\n{$message}");
        }
    }

    /**
     * Send via Twilio WhatsApp API
     */
    protected function sendViaTwilio(string $to, string $message): void
    {
        $accountSid = config('services.whatsapp.twilio_account_sid');
        $authToken = config('services.whatsapp.api_key');
        $from = config('services.whatsapp.twilio_from'); // Your Twilio WhatsApp number (format: whatsapp:+14155238886)
        
        if (empty($accountSid) || empty($authToken) || empty($from)) {
            throw new \Exception("Twilio credentials not configured. Check your .env file.");
        }

        $to = $this->formatPhoneNumber($to);
        if (!str_starts_with($to, '+')) {
            $to = '+' . $to;
        }
        $to = 'whatsapp:' . $to;

        $url = "https://api.twilio.com/2010-04-01/Accounts/{$accountSid}/Messages.json";

        $response = Http::asForm()
            ->withBasicAuth($accountSid, $authToken)
            ->post($url, [
                'From' => $from,
                'To' => $to,
                'Body' => $message,
            ]);

        if (!$response->successful()) {
            $error = $response->json();
            throw new \Exception("Twilio API error: " . ($error['message'] ?? $response->body()));
        }

        Log::info("Twilio WhatsApp message sent successfully to {$to}");
    }

    /**
     * Send via Meta WhatsApp Business API
     */
    protected function sendViaMeta(string $to, string $message): void
    {
        $phoneNumberId = config('services.whatsapp.meta_phone_number_id');
        $accessToken = config('services.whatsapp.meta_access_token');
        
        if (empty($phoneNumberId) || empty($accessToken)) {
            throw new \Exception("Meta WhatsApp credentials not configured. Check your .env file. Phone Number ID: " . ($phoneNumberId ?: 'missing') . ", Access Token: " . ($accessToken ? 'set' : 'missing'));
        }

        $to = $this->formatPhoneNumber($to);
        if (!str_starts_with($to, '+')) {
            $to = '+' . $to;
        }

        $url = "https://graph.facebook.com/v18.0/{$phoneNumberId}/messages";

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $accessToken,
            'Content-Type' => 'application/json',
        ])->post($url, [
            'messaging_product' => 'whatsapp',
            'to' => $to,
            'type' => 'text',
            'text' => [
                'body' => $message,
            ],
        ]);

        if (!$response->successful()) {
            $error = $response->json();
            throw new \Exception("Meta WhatsApp API error: " . ($error['error']['message'] ?? $response->body()));
        }

        Log::info("Meta WhatsApp message sent successfully to {$to}");
    }

    /**
     * Send via generic HTTP API
     */
    protected function sendViaHttp(string $to, string $message): void
    {
        if (empty($this->apiUrl)) {
            throw new \Exception("WhatsApp API URL not configured. Check your .env file.");
        }

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->apiKey,
            'Content-Type' => 'application/json',
        ])->post($this->apiUrl, [
            'to' => $this->formatPhoneNumber($to),
            'message' => $message,
        ]);

        if (!$response->successful()) {
            throw new \Exception("WhatsApp API error: " . $response->body());
        }

        Log::info("HTTP WhatsApp message sent successfully to {$to}");
    }

    /**
     * Format phone number for WhatsApp (add country code if needed)
     */
    protected function formatPhoneNumber(string $number): string
    {
        // Remove any non-numeric characters
        $number = preg_replace('/[^0-9]/', '', $number);
        
        // If number doesn't start with country code, you might want to add it
        // For example, if these are local numbers, add your country code
        // This is a placeholder - adjust based on your needs
        
        return $number;
    }
}

