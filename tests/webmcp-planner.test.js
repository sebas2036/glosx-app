const assert = require('assert');

async function runTests() {
  console.log('Running WebMCP Itinerary Planner tests...');

  // Test 1: navigator.modelContext missing scenario
  {
    delete global.navigator;
    delete require.cache[require.resolve('../assets/js/webmcp.js')];
    let threw = false;
    try {
      require('../assets/js/webmcp.js');
    } catch (e) {
      threw = true;
    }
    assert.strictEqual(threw, false, 'Should not fail when navigator.modelContext does not exist');
    console.log('PASS: navigator.modelContext missing check');
  }

  // Test 2: registerTool and register fallback with mock navigator
  {
    const registeredTools = {};
    global.navigator = {
      modelContext: {
        register: function(tool) {
          registeredTools[tool.name] = tool;
        }
      }
    };
    global.fetch = async (url, options) => {
      if (url === 'https://voxa-production-dc15.up.railway.app/affiliate') {
        const body = JSON.parse(options.body);
        assert.ok(body.prompt, 'Prompt should be sent to PROXY_BASE');
        assert.ok(body.region, 'Region should be sent to PROXY_BASE');
        return {
          ok: true,
          json: async () => ({
            duration: '2h 30m',
            price_estimate: '€60',
            omio_link: 'https://www.omio.com/link-madrid-barcelona',
            klook_link: 'https://www.klook.com/link-madrid-barcelona',
            hotels_link: 'https://www.booking.com/madrid-barcelona-hotels',
            segments: [
              {
                from: 'Madrid',
                to: 'Barcelona',
                operator: 'Renfe',
                duration: '2h 30m',
                departure_time: '08:00',
                arrival_time: '10:30',
                klook_link: 'https://www.klook.com/segment-madrid-barcelona',
                omio_link: 'https://www.omio.com/segment-madrid-barcelona'
              }
            ]
          })
        };
      }
      throw new Error('Unexpected fetch call');
    };

    delete require.cache[require.resolve('../assets/js/webmcp.js')];
    require('../assets/js/webmcp.js');

    assert.ok(registeredTools.plan_train_itinerary, 'plan_train_itinerary should be registered via fallback .register');
    const tool = registeredTools.plan_train_itinerary;
    assert.strictEqual(typeof tool.invoke, 'function');

    // Test parameter schema
    const schema = tool.parameters;
    assert.strictEqual(schema.type, 'object');
    assert.ok(schema.properties.trip_description);
    assert.ok(schema.properties.region);
    assert.ok(schema.properties.language);
    assert.deepStrictEqual(schema.required, ['trip_description', 'region']);

    // Test tool invocation
    const result = await tool.invoke({
      trip_description: 'Madrid to Barcelona',
      region: 'Europe',
      language: 'en'
    });

    assert.ok(result, 'Result should not be null');
    assert.strictEqual(result.estimated_duration, '2h 30m');
    assert.strictEqual(result.total_price_estimate, '€60');
    assert.strictEqual(result.segments.length, 1);
    assert.strictEqual(result.segments[0].origin, 'Madrid');
    assert.strictEqual(result.segments[0].destination, 'Barcelona');
    assert.strictEqual(result.affiliate_links.omio, 'https://www.omio.com/link-madrid-barcelona');
    assert.strictEqual(result.affiliate_links.klook, 'https://www.klook.com/link-madrid-barcelona');
    console.log('PASS: register fallback and tool invocation check');
  }

  // Test 3: registerTool primary method check
  {
    const registeredTools = {};
    global.navigator = {
      modelContext: {
        registerTool: function(tool) {
          registeredTools[tool.name] = tool;
        }
      }
    };
    delete require.cache[require.resolve('../assets/js/webmcp.js')];
    require('../assets/js/webmcp.js');

    assert.ok(registeredTools.plan_train_itinerary, 'plan_train_itinerary should be registered via registerTool');
    console.log('PASS: registerTool primary method check');
  }

  console.log('All WebMCP planner tests passed successfully!');
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
