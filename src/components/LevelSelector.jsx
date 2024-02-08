import {Component} from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";

import {CoolStyles} from "common/ui/CoolImports";

import FractoData from "fracto/common/data/FractoData";
import FractoUtil from "fracto/common/FractoUtil";

const MAX_LEVEL = 35;
const INDEX_WIDTH_PX = 40;
const ROW_HEIGHT_PX = 25;

const LevelsWraper = styled(CoolStyles.Block)`
   height: auto;
   background-color: #aaaaaa;
`;

const LevelRow = styled(CoolStyles.Block)`
   ${CoolStyles.pointer}
   ${CoolStyles.noselect}
   margin: 0;
   height: ${ROW_HEIGHT_PX}px;
`;

const IndexWraper = styled(CoolStyles.InlineBlock)`
   ${CoolStyles.align_right}
   margin: 0;
   width: ${INDEX_WIDTH_PX}px;
`;

const LevelIndex = styled(CoolStyles.InlineBlock)`
   ${CoolStyles.monospace}
   ${CoolStyles.noselect}
   ${CoolStyles.bold}
   ${CoolStyles.narrow_border_radius}
   color: black;
   border: 2px solid black;
   margin: 2px 2px 0 0;
   font-size: ${ROW_HEIGHT_PX - 8}px;
   height: ${ROW_HEIGHT_PX - 6}px;
   padding: 0 0.25rem;
`;

const ColorBarWrapper = styled(CoolStyles.InlineBlock)`
   ${CoolStyles.narrow_border_radius}
   border: 2px solid black;
   margin-top: 2px;   
`;

const ColorBar = styled(CoolStyles.InlineBlock)`
   height: ${ROW_HEIGHT_PX - 8}px;
`;

export class LevelSelector extends Component {

   static propTypes = {
      width_px: PropTypes.number.isRequired,
      selected_level: PropTypes.number.isRequired,
      on_level_select: PropTypes.func.isRequired,
   }

   state = {
      loading: true,
      bin_counts: {},
   };

   componentDidMount() {
      FractoData.load_bin_counts_async(returns => {
         this.setState({
            loading: false,
            bin_counts: returns,
         })
      });
   }

   get_bin_count = (bin, level) => {
      const {bin_counts} = this.state
      if (bin_counts[bin] && Array.isArray(bin_counts[bin])) {
         return bin_counts[bin][level]
      }
      return 0;
   }

   render_colorbar = (level) => {
      const {width_px} = this.props;
      const complete_count = this.get_bin_count("complete", level);
      const empty_count = this.get_bin_count("empty", level)
      const error_count = this.get_bin_count("error", level)
      const indexed_count = this.get_bin_count("indexed", level)
      const inland_count = this.get_bin_count("inland", level)
      const new_count = this.get_bin_count("new", level)
      const ready_count = this.get_bin_count("ready", level)
      const total = complete_count + empty_count + error_count + indexed_count + inland_count + new_count + ready_count;
      const bar_width_px = width_px - INDEX_WIDTH_PX - 12;
      const base_data = [
         {
            tooltip: `indexed : ${indexed_count}/${total} tiles`,
            width_px: (indexed_count * bar_width_px) / total,
            color: FractoUtil.fracto_pattern_color(3, 10000)
         },
         {
            tooltip: `complete : ${complete_count}/${total} tiles`,
            width_px: (complete_count * bar_width_px) / total,
            color: FractoUtil.fracto_pattern_color(5, 10000)
         },
         {
            tooltip: `ready : ${ready_count}/${total} tiles`,
            width_px: (ready_count * bar_width_px) / total,
            color: FractoUtil.fracto_pattern_color(9, 10000)
         },
         {
            tooltip: `inland : ${inland_count}/${total} tiles`,
            width_px: (inland_count * bar_width_px) / total,
            color: FractoUtil.fracto_pattern_color(17, 10000)
         },
         {
            tooltip: `new : ${new_count}/${total} tiles`,
            width_px: (new_count * bar_width_px) / total,
            color: FractoUtil.fracto_pattern_color(7, 10000)
         },
         {
            tooltip: `empty : ${empty_count}/${total} tiles`,
            width_px: (empty_count * bar_width_px) / total,
            color: FractoUtil.fracto_pattern_color(0, 10)
         },
         {
            tooltip: `error : ${error_count}/${total} tiles`,
            width_px: (error_count * bar_width_px) / total,
            color: FractoUtil.fracto_pattern_color(2, 10000)
         },
      ]
      return base_data.map((data, i) => {
         const style = {
            backgroundColor: data.color,
            width: `${data.width_px}px`
         };
         return <ColorBar
            key={`colorbar_${level}_${i}`}
            style={style}
            title={data.tooltip}
         />
      })

   }

   render() {
      const {loading} = this.state;
      const {selected_level, on_level_select} = this.props;
      const levels = new Array(MAX_LEVEL + 2).fill('')
      const unselected_style = {
         backgroundColor: "#888888",
         color: "#eeeeee"
      }
      for (let level = 2; level <= MAX_LEVEL; level++) {
         const colorbar = this.render_colorbar(level)
         const is_selected = level === selected_level;
         levels[level] = <LevelRow
            key={`sidebar-level-${level}`}
            style={{backgroundColor: is_selected ? "white" : '#aaaaaa'}}
            onClick={e => on_level_select(level)}>
            <IndexWraper>
               <LevelIndex style={is_selected ? {} : unselected_style}>{level}</LevelIndex>
            </IndexWraper>
            <ColorBarWrapper style={{opacity: is_selected ? 1.0 : 0.5}}>
               {colorbar}
            </ColorBarWrapper>
         </LevelRow>
      }
      return loading ? 'loading...' : <LevelsWraper>
         {levels}
      </LevelsWraper>
   }
}

export default LevelSelector;