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

interface JSTXH2_5mmProps {
  numPins?: number
  showPins?: boolean
  showFootprint?: boolean
  bodyColor?: string
  pinColor?: string
  smd?: boolean
  rightangle?: boolean
}

export const JSTXH2_5mm = ({
  numPins = 2,
  showPins = true,
  showFootprint = true,
  bodyColor = "#f5f5f5",
  pinColor = "#635959",
  smd = false,
  rightangle = false,
}: JSTXH2_5mmProps) => {
  const pitch = 2.5
  const A = (numPins - 1) * pitch
  const startX = -A / 2

  let bodyWidth = 0
  let bodyDepth = 0
  let bodyHeight = 0

  if (!smd && !rightangle) {
    bodyWidth = A + 4.9
    bodyDepth = 5.75
    bodyHeight = 9.8
  } else if (!smd && rightangle) {
    bodyWidth = A + 4.9
    bodyDepth = 11.5
    bodyHeight = 6.1
  } else if (smd && !rightangle) {
    // Top-entry SMT is non-standard for basic XH, but we approximate
    bodyWidth = A + 4.9
    bodyDepth = 5.75
    bodyHeight = 9.8
  } else {
    // smd && rightangle
    bodyWidth = A + 4.9
    bodyDepth = 11.5
    bodyHeight = 7.75
  }

  const wall = 0.6
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
                radius={0.4}
                center={[startX + i * pitch, 0, bodyHeight / 2]}
              />
            ) : (
              <Cylinder
                height={bodyHeight + 3}
                radius={0.4}
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
                size={[0.6, 2.5, 1.0]}
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
                pcb_plated_hole_id: `jstxh_${i}`,
                shape: "circular_hole_with_rect_pad",
                x: startX + i * pitch,
                y: 0,
                hole_diameter: 1.0,
                rect_pad_width: 1.5,
                rect_pad_height: 2.1,
                hole_shape: "circle",
                pad_shape: "rect",
                layers: ["top", "bottom"],
                port_hints: [`${i + 1}`],
              }
            : {
                type: "pcb_plated_hole",
                pcb_plated_hole_id: `jstxh_${i}`,
                shape: "pill",
                x: startX + i * pitch,
                y: 0,
                hole_height: 1.0,
                hole_width: 1.0,
                outer_height: 2.1,
                outer_width: 1.5,
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
          const padY = rightangle ? -1.0 : 1.0
          const padHeight = rightangle ? 3.0 : 3.5
          const padWidth = 1.2
          
          const pad: PcbSmtPad = {
            type: "pcb_smtpad",
            pcb_smtpad_id: `jstxh_${i}`,
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
              x: -(bodyWidth / 2) + 0.6,
              y: rightangle ? 8.5 : 3.0,
              width: 1.8,
              height: 3.5,
              layer: "top",
            }}
          />
          <FootprintPad
            pad={{
              type: "pcb_smtpad",
              pcb_smtpad_id: "mt_2",
              shape: "rect",
              x: (bodyWidth / 2) - 0.6,
              y: rightangle ? 8.5 : 3.0,
              width: 1.8,
              height: 3.5,
              layer: "top",
            }}
          />
        </>
      )}
    </>
  )
}

export default JSTXH2_5mm
