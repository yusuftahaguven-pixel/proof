export default async (request, context) => {
  // 1. Let the website load normally first
  const response = await context.next();
  
  try {
    // 2. Extract context network details safely
    const ip = context.ip || request.headers.get("x-nf-client-connection-ip") || "Unknown IP";
    const geo = context.geo || {};

    const locationData = {
      ip: ip,
      city: geo.city || "Unknown City",
      region: geo.subdivision?.name || "Unknown Region",
      country: geo.country?.name || "Unknown Country"
    };

    // 3. Duplicate response properties and inject data into headers string directly
    const newResponse = new Response(response.body, response);
    newResponse.headers.set("x-visitor-geo", JSON.stringify(locationData));
    
    return newResponse;

  } catch (error) {
    console.error("Edge function tracking failure caught cleanly:", error);
    return response;
  }
};
