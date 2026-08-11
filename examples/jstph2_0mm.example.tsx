import { JsCadView } from "jscad-fiber"
import { JSTPH2_0mm } from "lib/index"

export default () => {
  return (
    <JsCadView showGrid zAxisUp>
      <JSTPH2_0mm numPins={4} />
    </JsCadView>
  )
}
