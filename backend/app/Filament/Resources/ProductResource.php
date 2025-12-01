<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProductResource\Pages;
use App\Models\Product;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class ProductResource extends Resource
{
    protected static ?string $model = Product::class;

    protected static ?string $navigationIcon = 'heroicon-o-shopping-bag';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Product Information')
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->required()
                            ->maxLength(255)
                            ->live(onBlur: true)
                            ->afterStateUpdated(fn (string $context, $state, callable $set) => $context === 'create' ? $set('slug', Str::slug($state)) : null),

                        Forms\Components\TextInput::make('slug')
                            ->required()
                            ->maxLength(255)
                            ->unique(ignoreRecord: true),

                        Forms\Components\RichEditor::make('description')
                            ->columnSpanFull(),

                        Forms\Components\Select::make('category_id')
                            ->relationship('category', 'name')
                            ->searchable()
                            ->preload(),

                        Forms\Components\Toggle::make('is_active')
                            ->default(true),

                        Forms\Components\Toggle::make('is_featured')
                            ->default(false),
                    ])
                    ->columns(2),

                Forms\Components\Section::make('Product Details')
                    ->schema([
                        Forms\Components\Select::make('product_type')
                            ->options([
                                'bowl' => 'Bowl',
                                'cup' => 'Cup',
                                'spoon' => 'Spoon',
                                'plate' => 'Plate',
                                'lunch_bowl' => 'Lunch Bowl',
                                'bottle' => 'Bottle',
                                'gift_bag' => 'Gift Bag',
                                'other' => 'Other',
                            ])
                            ->searchable()
                            ->placeholder('Select product type'),

                        Forms\Components\Select::make('size')
                            ->options([
                                'small' => 'Small',
                                'medium' => 'Medium',
                                'large' => 'Large',
                            ])
                            ->placeholder('Select size'),

                        Forms\Components\TextInput::make('capacity')
                            ->maxLength(255)
                            ->placeholder('e.g., 250ml, 350ml, 500ml')
                            ->label('Capacity (for bottles)'),

                        Forms\Components\TextInput::make('material')
                            ->maxLength(255)
                            ->placeholder('e.g., Transparent Plastic, Plastic')
                            ->label('Material'),

                        Forms\Components\TextInput::make('color')
                            ->maxLength(255)
                            ->placeholder('e.g., Clear, White, Assorted')
                            ->label('Color'),
                    ])
                    ->columns(2)
                    ->collapsible(),

                Forms\Components\Section::make('Pricing & Inventory')
                    ->schema([
                        Forms\Components\TextInput::make('price')
                            ->required()
                            ->numeric()
                            ->prefix('$')
                            ->step(0.01),

                        Forms\Components\TextInput::make('compare_price')
                            ->numeric()
                            ->prefix('$')
                            ->step(0.01)
                            ->label('Compare at price'),

                        Forms\Components\TextInput::make('quantity')
                            ->required()
                            ->numeric()
                            ->default(0),

                        Forms\Components\TextInput::make('sku')
                            ->maxLength(255)
                            ->unique(ignoreRecord: true),

                        Forms\Components\TextInput::make('barcode')
                            ->maxLength(255),
                    ])
                    ->columns(2),

                Forms\Components\Section::make('Images')
                    ->schema([
                        Forms\Components\FileUpload::make('image')
                            ->image()
                            ->directory('products')
                            ->visibility('public'),

                        Forms\Components\FileUpload::make('images')
                            ->image()
                            ->multiple()
                            ->directory('products')
                            ->visibility('public'),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('image')
                    ->circular(),

                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('category.name')
                    ->sortable(),

                Tables\Columns\TextColumn::make('product_type')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'bowl' => 'Bowl',
                        'cup' => 'Cup',
                        'spoon' => 'Spoon',
                        'plate' => 'Plate',
                        'lunch_bowl' => 'Lunch Bowl',
                        'bottle' => 'Bottle',
                        'gift_bag' => 'Gift Bag',
                        'other' => 'Other',
                        default => $state,
                    })
                    ->sortable(),

                Tables\Columns\TextColumn::make('size')
                    ->badge()
                    ->sortable(),

                Tables\Columns\TextColumn::make('capacity')
                    ->sortable()
                    ->toggleable(),

                Tables\Columns\TextColumn::make('price')
                    ->money('USD')
                    ->sortable(),

                Tables\Columns\TextColumn::make('quantity')
                    ->sortable(),

                Tables\Columns\IconColumn::make('is_active')
                    ->boolean(),

                Tables\Columns\IconColumn::make('is_featured')
                    ->boolean(),

                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('category_id')
                    ->relationship('category', 'name'),

                Tables\Filters\TernaryFilter::make('is_active')
                    ->label('Active'),

                Tables\Filters\TernaryFilter::make('is_featured')
                    ->label('Featured'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListProducts::route('/'),
            'create' => Pages\CreateProduct::route('/create'),
            'edit' => Pages\EditProduct::route('/{record}/edit'),
        ];
    }
}

