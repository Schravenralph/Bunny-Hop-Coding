import { composePlugins, withNx } from '@nx/webpack';
import type { Configuration } from 'webpack';

export default composePlugins(withNx(), (config: Configuration): Configuration => {
  return config;
});

