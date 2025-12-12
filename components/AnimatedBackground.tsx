'use client';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a0a2e] to-[#0a0a0a]" />

      {/* Animated gradient mesh layers */}
      <div className="absolute inset-0 opacity-70">
        <div className="gradient-blob gradient-blob-1" />
        <div className="gradient-blob gradient-blob-2" />
        <div className="gradient-blob gradient-blob-3" />
        <div className="gradient-blob gradient-blob-4" />
      </div>

      {/* Noise texture overlay for depth */}
      <div className="absolute inset-0 opacity-[0.015] mix-blend-soft-light bg-noise" />

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(184, 69, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(184, 69, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px'
        }}
      />
    </div>
  );
}
