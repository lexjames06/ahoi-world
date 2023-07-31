type FeatureFlag = {
  flag: boolean;
  description: string;
};

type FeatureFlags = {
  [flag: string]: FeatureFlag;
};

export function getFeatureFlag(key: string): FeatureFlag | null {
  const featureFlagsString = process.env.NEXT_PUBLIC_FEATURE_FLAGS;
  const featureFlags = JSON.parse(featureFlagsString) as FeatureFlags;
  
  if (!!featureFlags[key]) {
    return featureFlags[key];
  }

  return null;
}