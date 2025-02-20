import Particles from "react-tsparticles";

export default function ParticleBackground() {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1, // 確保背景在最底層
      }}
    >
      <Particles
        options={{
          particles: {
            number: {
              value: 100,
              density: {
                enable: true,
                value_area: 800,
              },
            },
            size: {
              value: 3,
            },
            move: {
              enable: true,
              speed: 2,
            },
          },
        }}
      />
    </div>
  );
}
