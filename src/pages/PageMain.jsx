import React, {Component} from 'react';
import PropTypes from 'prop-types';
// import styled from "styled-components";

import AppPageMain from 'common/app/AppPageMain';
import LevelSelector from "./LevelSelector";

// import {CoolStyles} from 'common/ui/CoolImports';

export class PageMain extends Component {

   static propTypes = {
      app_name: PropTypes.string.isRequired,
   }

   state = {
      left_width: 0,
      right_width: 0,
      selected_level: 3
   };

   componentDidMount() {
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
   }

   render() {
      const {left_width, selected_level} = this.state;
      const {app_name} = this.props;
      const left_side = <LevelSelector
         width_px={left_width}
         selected_level={selected_level}
         on_level_select={this.on_level_select}
      />
      const right_side = "right side"
      return <AppPageMain
         app_name={app_name}
         on_resize={this.on_resize}
         content_left={left_side}
         content_right={right_side}
      />
   }
}

export default PageMain;
