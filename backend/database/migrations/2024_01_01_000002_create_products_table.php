<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->decimal('compare_price', 10, 2)->nullable();
            $table->string('sku')->unique()->nullable();
            $table->string('barcode')->nullable();
            $table->integer('quantity')->default(0);
            $table->boolean('is_active')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->foreignId('category_id')->nullable()->constrained()->onDelete('set null');
            $table->enum('product_type', ['bowl', 'cup', 'spoon', 'plate', 'lunch_bowl', 'bottle', 'gift_bag', 'other'])->nullable();
            $table->enum('size', ['small', 'medium', 'large'])->nullable();
            $table->string('capacity')->nullable()->comment('e.g., 250ml, 350ml, 500ml');
            $table->string('material')->nullable()->comment('e.g., Transparent Plastic, Plastic');
            $table->string('color')->nullable()->comment('e.g., Clear, White, Assorted');
            $table->string('image')->nullable();
            $table->json('images')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};

