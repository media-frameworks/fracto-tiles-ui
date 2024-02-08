import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";

import AppPageMain from 'common/app/AppPageMain';
import {CoolStyles} from 'common/ui/CoolImports';
import LevelSelector from "components/LevelSelector";
import LevelToolFrame, {
   TOOL_GENERATE, TOOL_DATA_SYNC
} from "components/LevelToolFrame";

import ToolDataSync from "./ToolDataSync";
import ToolGenerator from "./ToolGenerator";

const LS_SELECTED_LEVEL = "ls_selected_level"
const LS_SELECTED_TOOL = "ls_selected_tool"

const ContentWrapper = styled(CoolStyles.Block)`
   position: fixed;
   top: 70px;
   background-color: white;
   padding: 0.5rem
`

export class PageMain extends Component {

   static propTypes = {
      app_name: PropTypes.string.isRequired,
   }

   state = {
      left_width: 0,
      right_width: 0,
      selected_level: 3,
      tool_selector: TOOL_GENERATE
   };

   componentDidMount() {
      // const selected_level_str = localStorage.getItem(LS_SELECTED_LEVEL)
      // if (selected_level_str) {
      //    this.setState({selected_level: parseInt(selected_level_str)})
      // }
      const tool_selector = localStorage.getItem(LS_SELECTED_TOOL)
      if (tool_selector) {
         this.setState({tool_selector: tool_selector})
      }
   }

   on_resize = (left_width, right_width) => {
      console.log("on_resize", left_width, right_width)
      this.setState({
         left_width: left_width,
         right_width: right_width
      })
   }

   on_level_select = (level) => {
      this.setState({selected_level: level})
      localStorage.setItem(LS_SELECTED_LEVEL, `${level}`)
   }

   on_tool_select = (tool_selector) => {
      this.setState({tool_selector: tool_selector})
      localStorage.setItem(LS_SELECTED_TOOL, tool_selector)
   }

   render_content = () => {
      const {tool_selector, right_wodth, selected_level} = this.state
      switch (tool_selector) {
         case TOOL_DATA_SYNC:
            return <ToolDataSync
               level={selected_level}
               width_px={right_wodth}/>
         case TOOL_GENERATE:
            return <ToolGenerator
               level={selected_level}
               width_px={right_wodth}/>
         default:
            return `down't know about ${tool_selector}`
      }
   }

   render() {
      const {left_width, right_width, selected_level} = this.state;
      const {app_name} = this.props;
      const left_side = <LevelSelector
         width_px={left_width}
         selected_level={selected_level}
         on_level_select={this.on_level_select}
      />
      const right_side = [
         <LevelToolFrame
            width_px={right_width}
            level={selected_level}
            on_tool_select={this.on_tool_select}
         />,
         <ContentWrapper style={{width: right_width}}>
            {this.render_content()}
         </ContentWrapper>
      ]
      return <AppPageMain
         app_name={app_name}
         on_resize={this.on_resize}
         content_left={left_side}
         content_right={right_side}
      />
   }
}

export default PageMain;
