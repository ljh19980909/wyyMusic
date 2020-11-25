import React, { Component } from 'react';
import { MenuOutlined, SearchOutlined } from '@ant-design/icons';
import { NavLink, Route, HashRouter, Switch } from 'react-router-dom';
import Recommend from '../../Home/Recommend/Recommends/Recommend';
import Singers from '../../Home/Singers/Singers';
import Rank from '../../Home/Rank/Rank';
import Search from '../Search/Search';
import SongList from '../../SongLists/SongList/SongList';
import SingersList from '../../SongLists/SingersList/SingersList';
import AudioPlay from '../../AudioPlay/Audio/AudioPlay';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import './Header.css';

export default class Header extends Component {
    constructor(props) {
        super(props);
        console.log(this.props);
        this.state = {
            isdonghua: true,
        };
    }
    render() {
        return (
            <HashRouter>
                {/* 顶部导航栏 */}
                <div className="sc-bdVaJa ftPzZG">
                    <span className="iconfont menu">
                        <MenuOutlined />
                    </span>
                    <span className="title">云音悦</span>
                    <span className="iconfont search">
                        <NavLink to={'/search'}>
                            <SearchOutlined />
                        </NavLink>
                    </span>
                </div>
                {/* 三个跳转路由 */}
                <div className="sc-bwzfXH ekkJku">
                    <NavLink to={'/recommend'} activeClassName="selected">
                        <div className="sc-htpNat cwZJmE">
                            <span>推荐</span>
                        </div>
                    </NavLink>
                    <NavLink to={'/singers'} activeClassName="selected">
                        <div className="sc-htpNat cwZJmE">
                            <span>歌手</span>
                        </div>
                    </NavLink>
                    <NavLink to={'/rank'} activeClassName="selected">
                        <div className="sc-htpNat cwZJmE">
                            <span>排行榜</span>
                        </div>
                    </NavLink>
                </div>
                {/* 跳转的路由 */}
                <Switch>
                    <Route path="/recommend" component={Recommend}></Route>
                    <Route path="/singers" component={Singers}></Route>
                    <Route path="/rank" component={Rank}></Route>
                    <Route path="/search" component={Search}></Route>
                    <Route path="/songList" component={SongList}></Route>
                    <Route path="/singersList" component={SingersList}></Route>
                </Switch>
                <AudioPlay id={1243} />
            </HashRouter>
        );
    }
}
