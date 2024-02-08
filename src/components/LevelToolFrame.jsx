import {Component} from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";

import {CoolStyles} from "common/ui/CoolImports";
import FractoData, {
   BIN_VERB_INDEXED, BIN_VERB_INLAND, BIN_VERB_READY
} from "../fracto/common/data/FractoData";

export const TOOL_GENERATE = 'generate'
export const TOOL_DATA_SYNC = 'data sync'

const BUTTON_LABELS = [
   TOOL_GENERATE,
   TOOL_DATA_SYNC,
]

const TITLE_WIDTH_PX = 180;

const TitleBar = styled(CoolStyles.Block)`
   background: linear-gradient(120deg, white, #999999);
   height: 72px;
   width: 100%;
   overflow-x: noscroll;
`;

const ToolTitle = styled(CoolStyles.InlineBlock)`
   ${CoolStyles.uppercase}
   ${CoolStyles.bold}
   ${CoolStyles.align_center}
   letter-spacing: 0.25rem;
   font-size: 1.75rem;
   line-height: 46px;
   padding: 0.25rem 0.5rem;
   background-color: white;
   height: 46px;
   width: ${TITLE_WIDTH_PX}px;
   color: #444444;
`;

const HeaderButton = styled(CoolStyles.InlineBlock)`
   ${CoolStyles.noselect}
   ${CoolStyles.uppercase}
   ${CoolStyles.align_center}
   ${CoolStyles.bold}
   ${CoolStyles.pointer}
   ${CoolStyles.ellipsis}
   color: #666666;
   letter-spacing: 0.125rem;
   font-size: 0.85rem;
   padding: 0.125rem 0.75rem 0;
   margin: 0.25rem 0 0 0.25rem;
   border: 0.125rem solid #666666;
   background-color: #bbbbbb;
`;

const HeaderWrapper = styled(CoolStyles.InlineBlock)`
   overflow-x: hidden;
`;

export class LevelToolFrame extends Component {

   static propTypes = {
      width_px: PropTypes.number.isRequired,
      level: PropTypes.number.isRequired,
      on_tool_select: PropTypes.func.isRequired
   }

   state = {
      tool_specifier: TOOL_GENERATE,
      inland_tiles: [],
      indexed_tiles: [],
      ready_tiles: [],
      inland_tiles_loaded: false,
      indexed_tiles_loaded: false,
      ready_tiles_loaded: false,
   };

   componentDidMount() {
      this.load_level_tiles()
   }

   componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
      if (prevProps.level !== this.props.level) {
         this.setState({
            inland_tiles: [],
            indexed_tiles: [],
            ready_tiles: [],
            inland_tiles_loaded: false,
            indexed_tiles_loaded: false,
            ready_tiles_loaded: false,
         })
         setTimeout(() => {
            this.load_level_tiles()
         }, 100)
      }
   }

   load_level_tiles = () => {
      const {level} = this.props
      const inland_tiles = FractoData.get_cached_tiles(level, BIN_VERB_INLAND)
      const indexed_tiles = FractoData.get_cached_tiles(level, BIN_VERB_INDEXED)
      const ready_tiles = FractoData.get_cached_tiles(level, BIN_VERB_READY)
      this.setState({
         inland_tiles: inland_tiles,
         indexed_tiles: indexed_tiles,
         ready_tiles: ready_tiles,
         inland_tiles_loaded: true,
         indexed_tiles_loaded: true,
         ready_tiles_loaded: true,
      })
   }

   render_stats_bar = () => {
      const {
         inland_tiles, indexed_tiles, ready_tiles,
         indexed_tiles_loaded, inland_tiles_loaded, ready_tiles_loaded
      } = this.state
      if (!indexed_tiles_loaded || !inland_tiles_loaded || !ready_tiles_loaded) {
         return '...'
      }
      return `ready: ${ready_tiles.length} inland: ${inland_tiles.length} indexed: ${indexed_tiles.length}`
   }

   on_tab_select = (new_specifier) => {
      const {on_tool_select} = this.props
      this.setState({tool_specifier: new_specifier})
      on_tool_select(new_specifier)
   }

   render_button_bar = () => {
      const {tool_specifier} = this.state
      const {width_px} = this.props;
      const button_width = `${(width_px - 150) / 12}px`;
      const button_style = {width: button_width}
      const selected_style = {
         backgroundColor: "white",
         border: "0",
         height: "1.5rem",
         borderTopLeftRadius: "0.25rem",
         borderTopRightRadius: "0.25rem",
         textDecoration: "underline",
         width: button_width,
         fontSize: "1.125rem"
      }
      return BUTTON_LABELS.map(label => {
         return <HeaderButton
            onClick={e => this.on_tab_select(label)}
            style={label === tool_specifier ? selected_style : button_style}>
            {label}
         </HeaderButton>
      })
   }

   render() {
      const {width_px, level} = this.props
      const stats_bar = this.render_stats_bar()
      const button_bar = this.render_button_bar()
      const wrapper_style = {
         width: `${width_px - TITLE_WIDTH_PX - 50}px`
      }
      return [
         <TitleBar>
            <ToolTitle>{`level ${level}`}</ToolTitle>
            <HeaderWrapper style={wrapper_style}>
               {stats_bar}
               <CoolStyles.Block>{button_bar}</CoolStyles.Block>
            </HeaderWrapper>
         </TitleBar>
      ];
   }
}

export default LevelToolFrame;
