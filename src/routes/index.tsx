import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

/* Use suspense to lazy load pages, decreasing TTL */
const SearchPage = React.lazy(() => import("../pages/search"));

export const Pages = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Switch>
      <Route exact path='/' component={SearchPage} />
      <Route path='/search/track/:track' component={SearchPage} />
    </Switch>
  </Suspense>
);

const Routes = () => (
  <Router>
    <Pages />
  </Router>
);
export default Routes;
