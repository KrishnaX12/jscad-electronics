import {
  Colorize,
  Cuboid,
  Cylinder,
  Subtract,
  Translate,
} from "jscad-fiber"
import type { PcbPlatedHole, PcbSmtPad } from "circuit-json"
import { FootprintPlatedHole } from "./FootprintPlatedHole"
import { FootprintPad } from "./FootprintPad"

interface JSTPH2_0mmProps {
  numPins?: number
  showPins?: boolean
  showFootprint?: boolean
  bodyColor?: string
  pinColor?: string
  smd?: boolean
  rightangle?: boolean
}

export const JSTPH2_0mm = ({
  numPins = 2,
  showPins = true,
  showFootprint = true,
  bodyColor = "#f5f5f5",
  pinColor = "#635959",
  smd = false,
  rightangle = false,
}: JSTPH2_0mmProps) => {
  const pitch = 2.0
  const A = (numPins - 1) * pitch
  const startX = -A / 2

  let bodyWidth = 0
  let bodyDepth = 0
  let bodyHeight = 0

  if (!smd && !rightangle) {
    bodyWidth = A + 3.8
    bodyDepth = 4.5
    bodyHeight = 8.0
  } else if (!smd && rightangle) {
    bodyWidth = A + 3.9
    bodyDepth = 7.6
    bodyHeight = 4.8
  } else if (smd && !rightangle) {
    bodyWidth = A + 5.95
    bodyDepth = 5.0
    bodyHeight = 6.6
  } else {
    // smd && rightangle
    bodyWidth = A + 5.9
    bodyDepth = 6.0
    bodyHeight = 5.5
  }

  const wall = 0.5
  const bodyCenterY = rightangle ? bodyDepth / 2 - 1.0 : 0
  const bodyCenterZ = bodyHeight / 2

  // Cutout logic
  let hollowSize: [number, number, number] = [0, 0, 0]
  let hollowCenter: [number, number, number] = [0, 0, 0]

  if (!rightangle) {
    hollowSize = [bodyWidth - wall * 2, bodyDepth - wall * 2, bodyHeight * 0.7]
    hollowCenter = [0, bodyCenterY, bodyHeight - hollowSize[2] / 2]
  } else {
    hollowSize = [bodyWidth - wall * 2, bodyDepth * 0.7, bodyHeight - wall * 2]
    hollowCenter = [0, bodyCenterY + bodyDepth / 2 - hollowSize[1] / 2, bodyCenterZ]
  }

  return (
    <>
      <Translate>
        <Colorize color={bodyColor}>
          <Subtract>
            <Cuboid
              size={[bodyWidth, bodyDepth, bodyHeight]}
              center={[0, bodyCenterY, bodyCenterZ]}
            />
            <Cuboid
              size={hollowSize}
              center={hollowCenter}
            />
          </Subtract>
        </Colorize>
      </Translate>

      {showPins && !smd &&
        Array.from({ length: numPins }).map((_, i) => (
          <Colorize key={i} color={pinColor}>
            {rightangle ? (
              <Cylinder
                height={bodyHeight + 2}
                radius={0.35}
                center={[startX + i * pitch, 0, bodyHeight / 2]}
              />
            ) : (
              <Cylinder
                height={bodyHeight + 3}
                radius={0.35}
                center={[startX + i * pitch, 0, bodyHeight / 2]}
              />
            )}
          </Colorize>
        ))}

      {showPins && smd &&
        Array.from({ length: numPins }).map((_, i) => (
          <Colorize key={i} color={pinColor}>
            <Translate offset={[startX + i * pitch, rightangle ? -0.5 : 0, 0.5]}>
              <Cuboid
                size={[0.5, 2.0, 1.0]}
                center={[0, 0, 0]}
              />
            </Translate>
          </Colorize>
        ))}

      {showFootprint && !smd &&
        Array.from({ length: numPins }).map((_, i) => {
          const isPin1 = i === 0
          const hole: PcbPlatedHole = isPin1
            ? {
                type: "pcb_plated_hole",
                pcb_plated_hole_id: `jstph_${i}`,
                shape: "circular_hole_with_rect_pad",
                x: startX + i * pitch,
                y: 0,
                hole_diameter: 0.8,
                rect_pad_width: 1.2,
                rect_pad_height: 1.8,
                hole_shape: "circle",
                pad_shape: "rect",
                layers: ["top", "bottom"],
                port_hints: [`${i + 1}`],
              }
            : {
                type: "pcb_plated_hole",
                pcb_plated_hole_id: `jstph_${i}`,
                shape: "pill",
                x: startX + i * pitch,
                y: 0,
                hole_height: 0.8,
                hole_width: 0.8,
                outer_height: 1.8,
                outer_width: 1.2,
                layers: ["top", "bottom"],
                port_hints: [`${i + 1}`],
              }
          return (
            <FootprintPlatedHole
              key={`footprint_${i}`}
              hole={hole}
              isPin1={isPin1}
            />
          )
        })}

      {showFootprint && smd &&
        Array.from({ length: numPins }).map((_, i) => {
          const padY = rightangle ? -0.5 : 0.5
          const padHeight = rightangle ? 2.5 : 3.0
          const padWidth = 1.0
          
          const pad: PcbSmtPad = {
            type: "pcb_smtpad",
            pcb_smtpad_id: `jstph_${i}`,
            shape: "rect",
            x: startX + i * pitch,
            y: padY,
            width: padWidth,
            height: padHeight,
            layer: "top",
            port_hints: [`${i + 1}`],
          }
          return (
            <FootprintPad
              key={`footprint_${i}`}
              pad={pad}
              isPin1={i === 0}
            />
          )
        })}
        
      {/* SMT Mounting Tabs */}
      {showFootprint && smd && (
        <>
          <FootprintPad
            pad={{
              type: "pcb_smtpad",
              pcb_smtpad_id: "mt_1",
              shape: "rect",
              x: -(bodyWidth / 2) + (rightangle ? 0.4 : 0.8),
              y: rightangle ? 6.0 : 2.5,
              width: 1.6,
              height: 3.0,
              layer: "top",
            }}
          />
          <FootprintPad
            pad={{
              type: "pcb_smtpad",
              pcb_smtpad_id: "mt_2",
              shape: "rect",
              x: (bodyWidth / 2) - (rightangle ? 0.4 : 0.8),
              y: rightangle ? 6.0 : 2.5,
              width: 1.6,
              height: 3.0,
              layer: "top",
            }}
          />
        </>
      )}
    </>
  )
}

export default JSTPH2_0mm
