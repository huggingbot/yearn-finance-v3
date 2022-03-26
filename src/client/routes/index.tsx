import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import { Layout } from '@containers';

import { Home } from './Home';
import { VaultDetail } from './VaultDetail';
import { Wallet } from './Wallet';
import { Vaults } from './Vaults';
import { Labs } from './Labs';
import { LabDetail } from './LabDetail';
import { IronBank } from './IronBank';
import { Settings } from './Settings';
import { Disclaimer } from './Disclaimer';
import { Health } from './Health';

const routesMap = [
  {
    path: '/home',
    component: Home,
  },
  {
    path: '/wallet',
    component: Wallet,
  },
  {
    path: '/vaults',
    component: Vaults,
  },
  {
    path: '/labs',
    component: Labs,
  },
  {
    path: '/lab/:labAddress',
    component: LabDetail,
  },
  {
    path: '/ironBank',
    component: IronBank,
  },
  {
    path: '/settings',
    component: Settings,
  },
  {
    path: '/disclaimer',
    component: Disclaimer,
  },
  {
    path: '/vault/:vaultAddress',
    component: VaultDetail,
  },
];

export const Routes = () => {
  return (
    <Router basename="/#">
      <Switch>
        <Route exact path="/health" component={Health} />

        <Route>
          <Layout>
            <Switch>
              {routesMap.map((route, index) => (
                <Route key={index} exact path={route.path} component={route.component} />
              ))}
              <Route path="*">
                <Redirect to="/home" />
              </Route>
            </Switch>
          </Layout>
        </Route>
      </Switch>
    </Router>
  );
};
