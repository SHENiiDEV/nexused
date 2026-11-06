<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Resend, Postmark, AWS, and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'openai' => [
        'api_key' => env('OPENAI_API_KEY'),
        'model' => env('OPENAI_MODEL', 'gpt-4o-mini'),
    ],

    'corefy' => [
        'webhook_secret' => env('COREFY_WEBHOOK_SECRET', env('COREFY_SECRET_KEY', 'your_webhook_secret')),
        'secret_key' => env('COREFY_SECRET_KEY', env('COREFY_WEBHOOK_SECRET', 'your_webhook_secret')),
        'api_key' => env('COREFY_API_KEY'),
        'commerce_id' => env('COREFY_COMMERCE_ID', 'com_nexus_eu'),
        'api_url' => env('COREFY_API_URL', 'https://api.sterling-pay.com'),
        'cardgate_url' => env('COREFY_CARDGATE_URL', 'https://checkout.s-pay.finance'),
    ],

];
