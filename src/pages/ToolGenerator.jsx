import {Component} from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";

import {
   CoolButton, CoolSelect, CoolStyles
} from "common/ui/CoolImports";
import FractoCommon from "fracto/common/FractoCommon";
import FractoDataLoader, {TILE_SET_LOADING} from "fracto/common/data/FractoDataLoader";
import FractoData, {
   BIN_VERB_INLAND, BIN_VERB_READY, BIN_VERB_INDEXED
} from "fracto/common/data/FractoData";
import FractoTilePipeline, {
   SORT_TYPE_RADIAL, SORT_TYPE_CARTESIAN,
   TILE_OPTION_INLAND, TILE_OPTION_NO_INLAND, TILE_OPTION_ALL_TILES,
   SORT_LEFT_TO_RIGHT, SORT_RIGHT_TO_LEFT, SORT_TOP_TO_BOTTOM, SORT_BOTTOM_TO_TOP,
   LS_KEY_TILE_OPTION, LS_KEY_SORT_TYPE, LS_KEY_SORT_EXTRA
} from "components/FractoTilePipeline";

const SelectWrapper = styled(CoolStyles.InlineBlock)`
   margin-right: 0.5rem;
`

const DetailsWrapper = styled(CoolStyles.InlineBlock)`
   margin-left: 0.5rem;
`

export class ToolGenerator extends Component {

   static propTypes = {
      level: PropTypes.number.isRequired,
      width_px: PropTypes.number.isRequired,
   }

   state = {
      inland_loading: true,
      inland_tiles: [],
      ready_loading: true,
      ready_tiles: [],
      indexed_loading: true,
      indexed_tiles: [],
      sort_type: SORT_TYPE_RADIAL,
      sort_extra: SORT_LEFT_TO_RIGHT,
      tile_option: TILE_OPTION_NO_INLAND,
      started_run: false,
      pipeline_running: false,
   };

   componentDidMount() {
      this.load_inland_tiles()
      this.load_indexed_tiles()
      this.load_ready_tiles()
      this.init_level_settings()
   }

   componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
      const {level} = this.props
      if (level !== prevProps.level) {
         this.setState({
            inland_loading: true,
            inland_tiles: [],
            ready_loading: true,
            ready_tiles: [],
            indexed_loading: true,
            indexed_tiles: [],
         })
         this.load_inland_tiles()
         this.load_indexed_tiles()
         this.load_ready_tiles()
         this.init_level_settings()
      }
   }

   init_level_settings = () => {
      const {level} = this.props
      const sort_type = localStorage.getItem(`${LS_KEY_SORT_TYPE}_${level}`)
      const sort_extra = localStorage.getItem(`${LS_KEY_SORT_EXTRA}_${level}`)
      const tile_option = localStorage.getItem(`${LS_KEY_TILE_OPTION}_${level}`)
      this.setState({
         sort_type: sort_type ? sort_type : SORT_TYPE_RADIAL,
         sort_extra: sort_extra ? sort_extra : SORT_LEFT_TO_RIGHT,
         tile_option: tile_option ? tile_option : TILE_OPTION_NO_INLAND
      })
   }

   load_inland_tiles = () => {
      const {level} = this.props
      this.setState({inland_loading: true})
      FractoDataLoader.load_tile_set_async(BIN_VERB_INLAND, result => {
         if (result === TILE_SET_LOADING) {
            setTimeout(() => {
               this.load_inland_tiles()
            }, 1000)
         } else {
            const inland_tiles = FractoData.get_cached_tiles(level, BIN_VERB_INLAND)
            console.log("FractoDataLoader.load_tile_set_async", BIN_VERB_INLAND, inland_tiles.length)
            this.setState({
               inland_loading: false,
               inland_tiles: inland_tiles
            });
         }
      })
   }

   load_ready_tiles = () => {
      const {level} = this.props
      this.setState({ready_loading: true})
      FractoDataLoader.load_tile_set_async(BIN_VERB_READY, result => {
         if (result === TILE_SET_LOADING) {
            setTimeout(() => {
               this.load_ready_tiles()
            }, 1000)
         } else {
            const ready_tiles = FractoData.get_cached_tiles(level, BIN_VERB_READY)
            console.log("FractoDataLoader.load_tile_set_async", BIN_VERB_READY, ready_tiles.length)
            this.setState({
               ready_loading: false,
               ready_tiles: ready_tiles
            });
         }
      })
   }

   load_indexed_tiles = () => {
      const {level} = this.props
      this.setState({indexed_loading: true})
      FractoDataLoader.load_tile_set_async(BIN_VERB_INDEXED, result => {
         if (result === TILE_SET_LOADING) {
            setTimeout(() => {
               this.load_indexed_tiles()
            }, 1000)
         } else {
            const indexed_tiles = FractoData.get_cached_tiles(level, BIN_VERB_INDEXED)
            console.log("FractoDataLoader.load_tile_set_async", BIN_VERB_INDEXED, indexed_tiles.length)
            this.setState({
               indexed_loading: false,
               indexed_tiles: indexed_tiles
            });
         }
      })
   }

   on_sort_extra = (new_sort_extra) => {
      const {inland_loading, ready_loading} = this.state
      const {level} = this.props;
      if (inland_loading || ready_loading) {
         return
      }
      this.setState({sort_extra: new_sort_extra})
      localStorage.setItem(`${LS_KEY_SORT_EXTRA}_${level}`, new_sort_extra)
   }

   on_sort_type = (new_sort_type) => {
      const {inland_loading, ready_loading} = this.state
      const {level} = this.props;
      if (inland_loading || ready_loading) {
         return
      }
      this.setState({sort_type: new_sort_type})
      localStorage.setItem(`${LS_KEY_SORT_TYPE}_${level}`, new_sort_type)
   }

   on_tile_option = (new_tile_option) => {
      const {inland_loading, ready_loading} = this.state
      const {level} = this.props;
      if (inland_loading || ready_loading) {
         return
      }
      this.setState({tile_option: new_tile_option})
      localStorage.setItem(`${LS_KEY_TILE_OPTION}_${level}`, new_tile_option)
   }

   on_render_detail = () => {
      const {sort_type, sort_extra, tile_option} = this.state
      const type_options = [
         {label: "radial", value: SORT_TYPE_RADIAL, help: "outside-in"},
         {label: "cartesian", value: SORT_TYPE_CARTESIAN, help: "follow grid"},
      ]
      let extra_options = ''
      const tile_options = [
         {label: "inland only", value: TILE_OPTION_INLAND},
         {label: "ready only", value: TILE_OPTION_NO_INLAND},
         {label: "all tiles", value: TILE_OPTION_ALL_TILES},
      ]
      extra_options = <SelectWrapper><CoolSelect
         options={tile_options}
         value={tile_option}
         on_change={e => this.on_tile_option(e.target.value)}/>
      </SelectWrapper>
      let extra_select = ''
      if (sort_type === SORT_TYPE_CARTESIAN) {
         const extra_options = [
            {label: "left to right", value: SORT_LEFT_TO_RIGHT},
            {label: "right to left", value: SORT_RIGHT_TO_LEFT},
            {label: "top to bottom", value: SORT_TOP_TO_BOTTOM},
            {label: "bottom to top", value: SORT_BOTTOM_TO_TOP}
         ]
         extra_select = <SelectWrapper><CoolSelect
            options={extra_options}
            value={sort_extra}
            on_change={e => this.on_sort_extra(e.target.value)}/>
         </SelectWrapper>
      }
      // console.log("sort_type, sort_extra, tile_option", sort_type, sort_extra, tile_option)
      return <DetailsWrapper
         key={"run_config"}>
         <SelectWrapper><CoolSelect
            options={type_options}
            value={sort_type}
            on_change={e => this.on_sort_type(e.target.value)}/>
         </SelectWrapper>
         {extra_select}
         {extra_options}
      </DetailsWrapper>
   }

   toggle_run = () => {
      const {started_run} = this.state
      console.log("start run")
      this.setState({started_run: !started_run})
   }

   on_automate = (pipeline_running) => {
      this.setState({pipeline_running: pipeline_running})
   }

   render() {
      const {
         ready_loading, indexed_loading, inland_loading, started_run, pipeline_running,
         sort_type, sort_extra, tile_option
      } = this.state
      const {width_px, level} = this.props
      if (ready_loading || inland_loading || indexed_loading) {
         let loaded_so_far = []
         if (!ready_loading) {
            loaded_so_far.push("readies")
         }
         if (!inland_loading) {
            loaded_so_far.push("inlands")
         }
         if (!indexed_loading) {
            loaded_so_far.push("indexed")
         }
         const extra = !loaded_so_far.length ? '~' : loaded_so_far.join(' ~ ')
         return FractoCommon.loading_wait_notice(extra)
      }
      const detail = this.on_render_detail()
      const launch_button = <SelectWrapper
         key={"launch_button"}
         style={{paddingTop: '0.125rem'}}>
         <CoolButton
            disabled={pipeline_running}
            content={started_run ? "unload" : "Load Pipeline"}
            on_click={this.toggle_run}
            primary={1}
            style={{
               fontSize: '0.75rem',
               fontWeight: 'bold',
               textTransform: 'uppercase'
            }}
         />
      </SelectWrapper>
      const pipeline = !started_run ? '' : <CoolStyles.Block
         key={"tile_pipeline"}>
         <FractoTilePipeline
            width_px={width_px}
            level={level}
            sort_type={sort_type}
            sort_extra={sort_extra}
            tile_option={tile_option}
            on_automate={this.on_automate}
         />
      </CoolStyles.Block>
      return [
         detail,
         launch_button,
         pipeline
      ]
   }
}

export default ToolGenerator
