# 15. Promise Combinators (`Promise.all` vs `Promise.allSettled`)

## 1. Definition

**Promise Combinators** are static methods on the `Promise` object used to handle multiple promises concurrently.

- **`Promise.all(iterable)`** waits for all promises to resolve and returns an array of results. If _even one_ promise rejects, the entire `Promise.all` instantly rejects (fail-fast).
- **`Promise.allSettled(iterable)`** waits for all promises to finish (either resolve or reject) and returns an array of objects detailing the outcome and value/error of each promise. It never rejects.

## 2. Interview Explanation

_Imagine an interviewer asks: "If a dashboard makes three simultaneous API calls, how do you handle them? What happens if one fails?"_

**Expert Response:**
"If I need to fetch independent data for a dashboard, I don't `await` them sequentially because that creates a waterfall effect, doubling or tripling loading times. Instead, I fire them concurrently.

If the data is completely codependent (e.g., I need both user data and permission data to render anything), I use `Promise.all()`. It's 'fail-fast', meaning if the permission request fails, the whole operation rejects, and I can show a global error.

However, for an independent dashboard—like showing User Stats, Recent Matches, and Notifications—if the Notifications API goes down, the User Stats shouldn't break. In this case, I use `Promise.allSettled()`. It waits for everything to finish regardless of success or failure. I can then map over the results, render the successful data, and show localized 'failed to load' states for the specific widgets that rejected, providing a much more resilient User Experience."

## 3. Real-world Use Cases

- **`Promise.all`:** Payment processing flows. You might need to deduct inventory and charge the card simultaneously. If either fails, the whole transaction must fail and rollback.
- **`Promise.allSettled`:** Microservice architectures and Dashboards. Fetching data from 5 different independent microservices to populate a UI. You want to show whatever data successfully returned.

## 4. Step-By-Step Process (Practice Mode)

To build the Dashboard Data Loader:

1. **Mock APIs:** Create 3 functions returning Promises that resolve after different timeouts using `setTimeout` (e.g., 1000ms, 2000ms, 3000ms). Make one of them intentionally reject to test error handling.
2. **Sequential Load:** Wire a button to `await` each API one after another. Measure total time (it will be the sum of all timeouts, e.g., 1000+2000+3000 = 6000ms).
3. **Promise.all:** Wire a button to execute `Promise.all([api1, api2, api3])`. Wrap in `try/catch`. Observe that it immediately throws an error in `catch` the moment the failing API rejects, preventing the UI from rendering the successful ones.
4. **Promise.allSettled:** Wire a button to execute `Promise.allSettled([api1, api2, api3])`. Observe that it takes only as long as the slowest API (3000ms). Loop through the results array, check `.status === 'fulfilled'`, and render data accordingly.
