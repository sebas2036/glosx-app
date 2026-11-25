if (typeof navigator === 'undefined' || !navigator.modelContext) {
  console.log('WebMCP not supported in this browser.');
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      plan_train_itinerary: {
        invoke: async (params) => {
          if (params.trip_description.includes('Madrid to Barcelona') && params.region === 'Europe') {
            return {
              segments: [
                {
                  origin: 'Madrid',
                  destination: 'Barcelona',
                  operator: 'Renfe',
                  duration: '2h 30m',
                  departure_time: '08:00',
                  arrival_time: '10:30',
                  booking_link_klook: 'https://www.klook.com/link-madrid-barcelona',
                  booking_link_omio: 'https://www.omio.com/link-madrid-barcelona'
                }
              ],
              estimated_duration: '2h 30m',
              total_price_estimate: '€60',
              affiliate_links: {
                omio: 'https://www.omio.com/general-link',
                klook: 'https://www.klook.com/general-link',
                hotels: 'https://www.booking.com/madrid-barcelona-hotels'
              }
            };
          }
          if (params.trip_description.includes('Zurich to Milan') && params.region === 'Europe') {
            return {
              segments: [
                {
                  origin: 'Zurich',
                  destination: 'Milan',
                  operator: 'SBB/Trenitalia',
                  duration: '3h 30m',
                  departure_time: '07:00',
                  arrival_time: '10:30',
                  booking_link_klook: 'https://www.klook.com/link-zurich-milan',
                  booking_link_omio: 'https://www.omio.com/link-zurich-milan'
                }
              ],
              estimated_duration: '3h 30m',
              total_price_estimate: '€80',
              affiliate_links: {
                omio: 'https://www.omio.com/general-link',
                klook: 'https://www.klook.com/general-link',
                hotels: 'https://www.booking.com/zurich-milan-hotels'
              }
            };
          }
          return { error: 'Mock itinerary not found for this description and region.' };
        }
      }
    };
  }
} else {
  console.log('WebMCP supported. Registering plan_train_itinerary tool...');

  const toolDefinition = {
    name: 'plan_train_itinerary',
    description: 'Generates a train itinerary including segments, estimated times, and affiliate booking links (Klook/Omio) for a given trip description, region, and optional language.',
    parameters: {
      type: 'object',
      properties: {
        trip_description: {
          type: 'string',
          description: 'A free-text description of the desired train trip, e.g., "Madrid to Barcelona", "Zurich to Milan in 5 days", or "Scenic route through the Swiss Alps".'
        },
        region: {
          type: 'string',
          enum: ['Europe', 'Japan', 'China'],
          description: 'The geographical region for the train trip.'
        },
        language: {
          type: 'string',
          description: 'Optional language for the response (e.g., "en", "es", "fr"). Defaults to English if not provided.',
          default: 'en'
        }
      },
      required: ['trip_description', 'region']
    },
    async invoke(params) {
      try {
        const url = 'https://voxa-production-dc15.up.railway.app/affiliate';
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-WebMCP-Invocation': 'true'
          },
          body: JSON.stringify({
            prompt: params.trip_description,
            trip_description: params.trip_description,
            region: params.region ? params.region.toLowerCase() : 'europe',
            lang: params.language || 'en',
            language: params.language || 'en'
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        const itinerary = {
          segments: [],
          estimated_duration: data.duration || 'N/A',
          total_price_estimate: data.price_estimate || 'N/A',
          affiliate_links: {
            omio: data.omio_link || null,
            klook: data.klook_link || null,
            hotels: data.hotels_link || null,
          }
        };

        if (data.segments && Array.isArray(data.segments)) {
          data.segments.forEach(segment => {
            itinerary.segments.push({
              origin: segment.from,
              destination: segment.to,
              operator: segment.operator,
              duration: segment.duration,
              departure_time: segment.departure_time,
              arrival_time: segment.arrival_time,
              booking_link_klook: segment.klook_link || null,
              booking_link_omio: segment.omio_link || null,
            });
          });
        }

        return itinerary;

      } catch (error) {
        console.error('Error invoking plan_train_itinerary:', error);
        return { error: error.message || 'Failed to generate itinerary' };
      }
    }
  };

  const registerFn = navigator.modelContext.registerTool || navigator.modelContext.register;
  if (typeof registerFn === 'function') {
    registerFn.call(navigator.modelContext, toolDefinition);
  }
}
