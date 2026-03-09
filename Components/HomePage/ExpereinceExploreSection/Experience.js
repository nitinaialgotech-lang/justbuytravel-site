export default async function handler(req, res) {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
        return res.status(400).json({ error: "Latitude & longitude required" });
    }

    const query = `
    [out:json];
    (
      node(around:3000,${lat},${lng})["tourism"="attraction"];
      node(around:3000,${lat},${lng})["tourism"="museum"];
      node(around:3000,${lat},${lng})["leisure"="park"];
      node(around:3000,${lat},${lng})["amenity"="arts_centre"];
    );
    out body;
  `;

    try {
        const response = await fetch("https://overpass-api.de/api/interpreter", {
            method: "POST",
            headers: { "Content-Type": "text/plain" },
            body: query,
        });

        const data = await response.json();
        res.status(200).json(data.elements);
    } catch {
        res.status(500).json({ error: "Failed to fetch experiences" });
    }
}
