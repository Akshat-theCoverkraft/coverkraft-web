import React, { useEffect } from "react";
import styled from "@emotion/styled";
import { useSpring, animated } from "react-spring";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Svg = styled.svg`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
`;

const Circle = styled.circle`
  transition: stroke-dashoffset 0.35s;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
`;

const Text = styled.text`
  font-size: ${(props) => props.fontSize}px;
  fill: ${(props) => props.color};
  text-anchor: middle;
  dominant-baseline: middle;
`;

const ProgressBarCircle = ({
  progress,
  size = 80,
  strokeWidth = 7,
  fontSize = 14,
  color = "#8AC642", // app color
  shade = "#95a5a6", // background circle color
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

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
      <Svg size={size}>
        {/* Background circle */}
        <Circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke={shade}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Animated progress circle */}
        <animated.circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={animatedProps.progress.to(
            (val) => circumference - (val / 100) * circumference
          )}
        />
        {/* Percentage text */}
        <Text x="50%" y="50%" fontSize={fontSize} color={color}>
          {`${roundedProgress}%`}
        </Text>
      </Svg>
    </Container>
  );
};

export default ProgressBarCircle;
