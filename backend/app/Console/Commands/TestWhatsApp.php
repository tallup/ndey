<?php

namespace App\Console\Commands;

use App\Models\Order;
use App\Services\WhatsAppService;
use Illuminate\Console\Command;

class TestWhatsApp extends Command
{
    protected $signature = 'whatsapp:test {order_id?}';
    protected $description = 'Test WhatsApp notification for an order';

    public function handle()
    {
        $orderId = $this->argument('order_id');
        
        if ($orderId) {
            $order = Order::with('products')->find($orderId);
            if (!$order) {
                $this->error("Order #{$orderId} not found!");
                return 1;
            }
        } else {
            $order = Order::with('products')->latest()->first();
            if (!$order) {
                $this->error("No orders found. Please create an order first.");
                return 1;
            }
            $this->info("Using latest order: #{$order->order_number}");
        }

        $this->info("Testing WhatsApp notification for Order #{$order->order_number}");
        $this->newLine();

        $whatsappService = app(WhatsAppService::class);
        
        try {
            $success = $whatsappService->sendOrderNotification($order);
            
            if ($success) {
                $this->info("✅ WhatsApp notification sent successfully!");
                $this->info("Check your logs at: storage/logs/laravel.log");
            } else {
                $this->warn("⚠️  Some notifications may have failed. Check logs for details.");
            }
        } catch (\Exception $e) {
            $this->error("❌ Error: " . $e->getMessage());
            return 1;
        }

        return 0;
    }
}

