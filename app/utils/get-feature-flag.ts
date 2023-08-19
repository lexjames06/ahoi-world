type FeatureFlag = {
  name: string;
  enabled: boolean;
  description: string;
};

export type FeatureFlags = {
  [flag: string]: FeatureFlag;
};

const FEATURE_FLAG_PREFIX = "NEXT_PUBLIC_FF_";
const FLAG_SUFFIX = "_FLAG";
const DESCRIPTION_SUFFIX = "_DESCRIPTION";

/**
 * Get Feature Flags
 * 
 * 
 * @example
 * const { auth } = getFeatureFlags();
 * 
 * if (!auth || !auth.enabled) {
 *   return redirect("/");
 * }
 * 
 * return <SignInPage />;
 */
export function getFeatureFlags(): FeatureFlags {
  const featureFlagEnvVars = Object.entries(process.env).filter(([key, value]) => key.startsWith(FEATURE_FLAG_PREFIX) && !!value) as [string, string][];
  const featureFlags = featureFlagEnvVars.reduce((flags: FeatureFlags, [key, value]) => {
    const featureTag = key.split(FEATURE_FLAG_PREFIX)[1];
    
    if (featureTag.endsWith(FLAG_SUFFIX)) {
      const featureName = featureTag.split(FLAG_SUFFIX)[0].toLowerCase();
      return {
        ...flags,
        [featureName]: {
          ...(flags[featureName] && flags[featureName]),
          enabled: value === "true",
        },
      };
    } else if (featureTag.endsWith(DESCRIPTION_SUFFIX)) {
      const featureName = featureTag.split(DESCRIPTION_SUFFIX)[0].toLowerCase();
      return {
        ...flags,
        [featureName]: {
          ...(flags[featureName] && flags[featureName]),
          description: value,
        },
      };
    }

    return flags;
  }, {});

  return featureFlags;
}