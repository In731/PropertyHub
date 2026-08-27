// Helper function to map database row to frontend property model
function rowToProperty(row) {
  return {
    id:          row.id,
    title:       row.title,
    price:       Number(row.price),
    location:    row.location,
    city:        row.city,
    lat:         row.lat ? parseFloat(row.lat) : undefined,
    lng:         row.lng ? parseFloat(row.lng) : undefined,
    bedrooms:    row.bedrooms ?? 0,
    bathrooms:   row.bathrooms ?? 0,
    area:        Number(row.area),
    type:        row.type,
    status:      row.status,
    image:       row.image,
    images:      row.images ?? [row.image],
    description: row.description ?? "",
    amenities:   row.amenities ?? [],
    yearBuilt:   row.year_built ?? undefined,
    parking:     row.parking ?? 0,
    furnished:   row.furnished ?? false,
    reraNumber:  row.rera_number ?? undefined,
    userId:      row.user_id ?? undefined,
    userName:    row.user_name ?? undefined,
  };
}

module.exports = {
  rowToProperty
};
