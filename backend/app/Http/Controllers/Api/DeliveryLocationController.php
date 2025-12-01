<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DeliveryLocation;
use Illuminate\Http\Request;

class DeliveryLocationController extends Controller
{
    public function index()
    {
        $locations = DeliveryLocation::where('is_active', true)
            ->orderBy('name')
            ->get();

        return response()->json($locations);
    }

    public function calculateFee($locationId)
    {
        $location = DeliveryLocation::find($locationId);

        if (!$location || !$location->is_active) {
            return response()->json([
                'fee' => 0,
                'message' => 'Location not found or inactive'
            ]);
        }

        return response()->json([
            'fee' => $location->delivery_fee ?? 0,
            'location' => $location->name
        ]);
    }
}
