import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";

import network from "common/config/network.json";

import {CoolStyles, CoolButton} from "common/ui/CoolImports"
import FractoCommon from "fracto/common/FractoCommon";
import FractoDataLoader from "fracto/common/data/FractoDataLoader";
import FractoData, {
   BIN_VERB_INLAND,
   BIN_VERB_READY,
   BIN_VERB_INDEXED
} from "fracto/common/data/FractoData";

const FRACTO_DB_URL = network.db_server_url;

const ButtonWrapper = styled(CoolStyles.InlineBlock)`
   margin-left: 0.5rem;
`

export class ToolDataSync extends Component {

   static propTypes = {
      level: PropTypes.number.isRequired,
      width_px: PropTypes.number.isRequired,
   }

   state = {
      inland_loading: false,
      inland_tiles: [],
      ready_loading: false,
      ready_tiles: [],
      indexed_loading: false,
      indexed_tiles: [],
      db_tiles_loading: false,
      db_tiles: [],
      db_tile_short_codes: {}
   };

   componentDidMount() {
      this.fetch_ready_tiles()
   }

   componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
      const {level} = this.props
      if (level !== prevProps.level) {
         this.fetch_ready_tiles()
      }
   }

   fetch_ready_tiles = () => {
      const {level} = this.props
      this.setState({db_tiles_loading: true})
      const url = `${FRACTO_DB_URL}/ready_tiles?level=${level}`
      fetch(url)
         .then(response => response.text())
         .then((str) => {
            const db_tiles = JSON.parse(str)
            console.log("fetch_ready_tiles returns (count)", db_tiles.length)
            let db_tile_short_codes = {}
            for (let i = 0; i < db_tiles.length; i++) {
               db_tile_short_codes[db_tiles[i].short_code] = true
            }
            this.setState({
               db_tiles: db_tiles,
               db_tile_short_codes: db_tile_short_codes,
               db_tiles_loading: false
            })
         })
   }

   load_inland_tiles = () => {
      const {level} = this.props
      this.setState({inland_loading: true})
      FractoDataLoader.load_tile_set_async(BIN_VERB_INLAND, result => {
         const inland_tiles = FractoData.get_cached_tiles(level, BIN_VERB_INLAND)
         console.log("FractoDataLoader.load_tile_set_async", BIN_VERB_INLAND, result.length)
         this.setState({
            inland_loading: false,
            inland_tiles: inland_tiles
         });
      })
   }

   load_ready_tiles = () => {
      const {level} = this.props
      this.setState({ready_loading: true})
      FractoDataLoader.load_tile_set_async(BIN_VERB_READY, result => {
         const ready_tiles = FractoData.get_cached_tiles(level, BIN_VERB_READY)
         console.log("FractoDataLoader.load_tile_set_async", BIN_VERB_READY, result.length)
         this.setState({
            ready_loading: false,
            ready_tiles: ready_tiles
         });
      })
   }

   load_indexed_tiles = () => {
      const {level} = this.props
      this.setState({indexed_loading: true})
      FractoDataLoader.load_tile_set_async(BIN_VERB_INDEXED, result => {
         const indexed_tiles = FractoData.get_cached_tiles(level, BIN_VERB_INDEXED)
         console.log("FractoDataLoader.load_tile_set_async", BIN_VERB_INDEXED, result.length)
         this.setState({
            indexed_loading: false,
            indexed_tiles: indexed_tiles
         });
      })
   }

   render() {
      const {ready_loading, indexed_loading, inland_loading, db_tiles_loading} = this.state
      const {level} = this.props
      if (ready_loading || inland_loading || indexed_loading) {
         return FractoCommon.loading_wait_notice()
      }
      if (db_tiles_loading) {
         return `loading tile states for level ${level}...`
      }
      const button_specs = {
         "ready": this.load_ready_tiles,
         "inland": this.load_inland_tiles,
         "indexed": this.load_indexed_tiles,
      }
      const all_buttons = ["ready","inland","indexed"].map(label => {
         return <CoolButton
            primary={1}
            content={label}
            on_click={button_specs[label]}
         />
      }).map(button => {
         return <ButtonWrapper>{button}</ButtonWrapper>
      })

      return [
         all_buttons
      ]
   }
}

export default ToolDataSync
