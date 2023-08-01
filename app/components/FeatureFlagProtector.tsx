import { redirect } from "next/navigation";
import { getFeatureFlag } from "../utils/get-feature-flag";

type Props = {
  feature: string;
  children: React.ReactElement;
  redirectPath?: string;
  returnNull?: boolean;
};

export default function FeatureFlagProtector({ children, feature, redirectPath, returnNull }: Props) {
  const featureFlag = getFeatureFlag(feature);

  if (!featureFlag.enabled && redirectPath) {
    redirect(redirectPath);
  }

  if (!featureFlag.enabled && returnNull) {
    return null;
  }

  return children;
}