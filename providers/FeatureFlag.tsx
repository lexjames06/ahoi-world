"use client";
import React, { useEffect, useState } from "react";
import { FeatureFlags, getFeatureFlags } from "@ahoi-world/utils/get-feature-flag";

export const FeatureFlagContext = React.createContext<FeatureFlags>({});

export const useFeatureFlagContext = () => React.useContext(FeatureFlagContext);

export const FeatureFlagContextProvider = ({
  children,
}: { children: React.ReactNode }) => {
  const [flags, setFlags] = useState<FeatureFlags>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const featureFlags = getFeatureFlags();
    setFlags(featureFlags);
    setLoading(false);
  }, []);

  return (
    <FeatureFlagContext.Provider value={flags}>
      {loading? "loading" : children}
    </FeatureFlagContext.Provider>
  );
}