import { animated as a, config, useSpring } from '@react-spring/three'

const Piece3D = ({position, color, king, isSelected, captured, onRemove}) => {
    // animate position
    const {pos, opacity} = useSpring({
        pos: position,
        opacity: captured ? 0 : 1,
        config: config.stiff,
        onRest: () => { if (captured && onRemove) onRemove(); }
    });

  return !captured ?  (
    <a.mesh position={pos}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 32]} />
        <meshStandardMaterial 
            color={color}
            emissive={isSelected ? "Cyan" : "black"}
            emissiveIntensity={isSelected ? 0.6 : 0}
            opacity={opacity}
        />
        {king && (
            <mesh position={[0, 0.2, 0]}>
                <coneGeometry args={[0.2, 0.2, 32]} />
                <meshStandardMaterial color="gold" />
            </mesh>
        )}
    </a.mesh>
  ) : null;
}

export default Piece3D