<?php

return [
    'whatsapp' => [
        'provider' => env('WHATSAPP_PROVIDER', 'log'), // Options: 'log', 'twilio', 'meta', 'http'
        'api_url' => env('WHATSAPP_API_URL', ''),
        'api_key' => env('WHATSAPP_API_KEY', ''),
        'recipient_numbers' => env('WHATSAPP_RECIPIENT_NUMBERS', '3740280,3569074'),
        
        // Twilio specific
        'twilio_account_sid' => env('TWILIO_ACCOUNT_SID', ''),
        'twilio_from' => env('TWILIO_WHATSAPP_FROM', ''), // Format: whatsapp:+14155238886
        
        // Meta WhatsApp Business API specific
        'meta_phone_number_id' => env('META_PHONE_NUMBER_ID', ''),
        'meta_access_token' => env('META_ACCESS_TOKEN', ''),
    ],
];

