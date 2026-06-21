import skeletonStyles from "./Skeleton.module.css";

type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className }: SkeletonProps): JSX.Element {
  return <span className={`${skeletonStyles.skeleton} ${className ?? ""}`} />;
}
