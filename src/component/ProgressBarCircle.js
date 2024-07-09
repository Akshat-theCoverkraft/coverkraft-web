import React, { useEffect } from "react";
import styled from "@emotion/styled";
import { useSpring, animated } from "react-spring";

const APP_COLOR = "#3498db"; // Replace with your app color
const APP_COLOR_SHADE = "#95a5a6"; // Replace with your app color shade

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Svg = styled.svg`
  width: 100px;
  height: 100px;
`;

const Circle = styled.circle`
  transition: stroke-dashoffset 0.35s;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
`;

const Text = styled.text`
  font-size: 14px;
  fill: ${APP_COLOR};
  text-anchor: middle;
  dominant-baseline: middle;
`;

const ProgressBarCircle = ({ progress }) => {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeWidth = 7;

  const [animatedProps, setAnimatedProps] = useSpring(() => ({
    progress: 0,
    config: { duration: 1000 },
  }));

  useEffect(() => {
    setAnimatedProps({ progress });
  }, [progress, setAnimatedProps]);

  const roundedProgress = Math.round(progress);

  return (
    <Container>
      <Svg>
        <Circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke={APP_COLOR_SHADE}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <animated.circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke={APP_COLOR}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={animatedProps.progress.to(
            (val) => circumference - (val / 100) * circumference
          )}
        />
        <Text x="50%" y="50%">
          {`${roundedProgress}%`}
        </Text>
      </Svg>
    </Container>
  );
};

export default ProgressBarCircle;
