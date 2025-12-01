<?php

namespace App\Filament\Resources;

use App\Filament\Resources\DeliveryLocationResource\Pages;
use App\Filament\Resources\DeliveryLocationResource\RelationManagers;
use App\Models\DeliveryLocation;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class DeliveryLocationResource extends Resource
{
    protected static ?string $model = DeliveryLocation::class;

    protected static ?string $navigationIcon = 'heroicon-o-map-pin';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(255)
                    ->label('Village Name'),

                Forms\Components\Select::make('region')
                    ->options([
                        'West Coast' => 'West Coast',
                    ])
                    ->default('West Coast')
                    ->required()
                    ->disabled(),

                Forms\Components\TextInput::make('delivery_fee')
                    ->numeric()
                    ->prefix('D')
                    ->nullable()
                    ->step(0.01)
                    ->label('Delivery Fee (leave empty for free delivery)')
                    ->helperText('Leave empty to make delivery free for this location'),

                Forms\Components\Toggle::make('is_active')
                    ->default(true)
                    ->label('Active'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable()
                    ->label('Village Name'),

                Tables\Columns\TextColumn::make('region')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('delivery_fee')
                    ->formatStateUsing(fn ($state) => $state ? 'D' . number_format($state, 2) : 'Free')
                    ->sortable()
                    ->label('Delivery Fee'),

                Tables\Columns\IconColumn::make('is_active')
                    ->boolean()
                    ->label('Active'),

                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('region')
                    ->options([
                        'West Coast' => 'West Coast',
                    ]),

                Tables\Filters\TernaryFilter::make('is_active')
                    ->label('Active'),
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
            'index' => Pages\ListDeliveryLocations::route('/'),
            'create' => Pages\CreateDeliveryLocation::route('/create'),
            'edit' => Pages\EditDeliveryLocation::route('/{record}/edit'),
        ];
    }
}
