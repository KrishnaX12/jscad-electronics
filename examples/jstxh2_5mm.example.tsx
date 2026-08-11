import { JsCadView } from "jscad-fiber"
import { JSTXH2_5mm } from "lib/index"

export default () => {
  return (
    <JsCadView showGrid zAxisUp>
      <JSTXH2_5mm numPins={4} />
    </JsCadView>
  )
}
