import {Component} from 'react';
import PropTypes from 'prop-types';
// import styled from "styled-components";

import FractoData, {
   BIN_VERB_INLAND, BIN_VERB_READY
} from "fracto/common/data/FractoData";
import FractoTileAutomator from "fracto/common/tile/FractoTileAutomator";

export const SORT_TYPE_RADIAL = "sort_type_radial"
export const SORT_TYPE_CARTESIAN = "sort_type_cartesian"

export const TILE_OPTION_INLAND = "tile_option_inland"
export const TILE_OPTION_NO_INLAND = "tile_option_no_inland"
export const TILE_OPTION_ALL_TILES = "tile_option_all_tiles"

export const SORT_LEFT_TO_RIGHT = "sort_left_to_right"
export const SORT_RIGHT_TO_LEFT = "sort_right_to_left"
export const SORT_TOP_TO_BOTTOM = "sort_top_to_bottom"
export const SORT_BOTTOM_TO_TOP = "sort_bottom_to_top"

export const LS_KEY_SORT_TYPE = 'LS_KEY_SORT_TYPE'
export const LS_KEY_SORT_EXTRA = 'LS_KEY_SORT_EXTRA'
export const LS_KEY_TILE_OPTION = 'LS_KEY_TILE_OPTION'

export class FractoTilePipeline extends Component {

   static propTypes = {
      level: PropTypes.number.isRequired,
      width_px: PropTypes.number.isRequired,
      sort_type: PropTypes.string.isRequired,
      sort_extra: PropTypes.string.isRequired,
      tile_option: PropTypes.string.isRequired,
      on_automate:PropTypes.func.isRequired,
   }

   state = {
      tileset: []
   }

   componentDidMount() {
      this.build_tileset()
   }

   componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
      const level_match = prevProps.level === this.props.level
      const sort_type_match = prevProps.sort_type === this.props.sort_type
      const sort_extra_match = prevProps.sort_extra === this.props.sort_extra
      const tile_option_match = prevProps.tile_option === this.props.tile_option
      if (!level_match || !sort_extra_match || !sort_type_match || !tile_option_match) {
         this.setState({tileset: []})
         setTimeout(() => {
            this.build_tileset()
         }, 250)
      }
   }

   build_tileset = () => {
      const {level, tile_option, sort_type, sort_extra} = this.props
      const ready_tiles = tile_option === TILE_OPTION_INLAND ? [] :
         FractoData.get_cached_tiles(level, BIN_VERB_READY)
      console.log("ready_tiles", ready_tiles)
      const inland_tiles = tile_option === TILE_OPTION_NO_INLAND ? [] :
         FractoData.get_cached_tiles(level, BIN_VERB_INLAND)
      console.log("inland_tiles", inland_tiles)
      const tileset = ready_tiles.concat(inland_tiles)
         .sort((a, b) => {
            const a_bounds = a.bounds
            const b_bounds = b.bounds
            if (sort_type === SORT_TYPE_RADIAL) {
               const a_left = a_bounds.left + 0.25
               const b_left = b_bounds.left + 0.25
               const a_distance = Math.sqrt(a_left * a_left + a_bounds.top * a_bounds.top)
               const b_distance = Math.sqrt(b_left * b_left + b_bounds.top * b_bounds.top)
               return a_distance > b_distance ? -1 : 1
            } else {
               switch (sort_extra) {
                  case SORT_LEFT_TO_RIGHT:
                     return a_bounds.left === b_bounds.left ?
                        (a_bounds.top > b_bounds.top ? -1 : 1) :
                        (a_bounds.left > b_bounds.left ? 1 : -1)
                  case SORT_RIGHT_TO_LEFT:
                     return a_bounds.left === b_bounds.left ?
                        (a_bounds.top > b_bounds.top ? -1 : 1) :
                        (a_bounds.left > b_bounds.left ? -1 : 1)
                  case SORT_TOP_TO_BOTTOM:
                     return a_bounds.top === b_bounds.top ?
                        (a_bounds.left > b_bounds.left ? -1 : 1) :
                        (a_bounds.top > b_bounds.top ? -1 : 1)
                  case SORT_BOTTOM_TO_TOP:
                     return a_bounds.top === b_bounds.top ?
                        (a_bounds.left > b_bounds.left ? -1 : 1) :
                        (a_bounds.top > b_bounds.top ? 1 : -1)
                  default:
                     return 0;
               }
            }
         })
      console.log("tileset", tileset)
      this.setState({
         tileset: tileset
      })
   }

   on_tile_action = (tile, cb) => {
      console.log("generate_toolchain", tile)
      cb(`${tile.short_code} added`)
   }

   render() {
      const {tileset} = this.state
      const {level, width_px,on_automate} = this.props
      if (!tileset.length) {
         return "building tileset..."
      }
      return [
         <FractoTileAutomator
            all_tiles={tileset}
            level={level}
            tile_action={this.on_tile_action}
            descriptor={"pipeline"}
            width_px={width_px}
            // on_render_detail={(tile, detail_width_px) => this.on_render_detail(tile, detail_width_px)}
            // on_render_tile={this.on_render_tile}
            auto_refresh={0}
            on_automate={on_automate}
         />
      ]
   }
}

export default FractoTilePipeline
