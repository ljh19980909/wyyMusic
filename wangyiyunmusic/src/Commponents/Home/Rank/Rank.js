import React, { Component } from 'react';
import './Rank.css';
import Network from '../../Fetch/network';
import Store from '../../ReactRedux/Store/Store';
import { add } from '../../ReactRedux/Actions/Actions';

export default class Rank extends Component {
    constructor(props) {
        super(props);
        this.state = { ranking_list: [], Global_list: [] };
    }
    songfests(id) {
        this.props.history.push({ pathname: '/SongList', state: { id } });
        Store.dispatch(add(id));
    }
    render() {
        return (
            <div className="sc-Rmtcm eCZUuL">
                <div className="sc-EHOje jiwVax">
                    <div>
                        {/* 官方榜 */}
                        <h1 className="offical">官方榜</h1>
                        <ul className="sc-bRBYWo itPPVh">
                            {this.state.ranking_list.map((v, i) => {
                                return (
                                    <li
                                        className="sc-hzDkRC azAvv"
                                        key={i}
                                        onClick={() => this.songfests(v.id)}
                                    >
                                        <div className="img_wrapper">
                                            <img src={v.coverImgUrl} alt="" />
                                            <div className="decorate"></div>
                                            <span className="update_frequecy">
                                                {v.updateFrequency}
                                            </span>
                                        </div>
                                        <ul className="sc-jhAzac iVFnEQ">
                                            {v.tracks.map((a, i) => {
                                                return (
                                                    <li key={i}>
                                                        {i + 1}.{a.first}-{a.second}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </li>
                                );
                            })}
                        </ul>
                        {/* 全球榜 */}
                        <h1 className="global">全球榜</h1>
                        <ul className="sc-kkGfuU hgkXNO">
                            {this.state.Global_list.map((v, i) => {
                                return (
                                    <li
                                        className="sc-iAyFgw cNkMjy"
                                        key={i}
                                        onClick={() => this.songfests(v.id)}
                                    >
                                        <div className="img_wrapper">
                                            <img src={v.coverImgUrl} alt="" />
                                            <div className="decorate"></div>
                                            <span className="update_frequecy">
                                                {v.updateFrequency}
                                            </span>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
    componentDidMount() {
        Network.get('/toplist/detail')
            .then(data => {
                this.setState({
                    ranking_list: data.list.slice(0, 4),
                    Global_list: data.list.slice(4),
                });
            })
            .catch(error => {
                console.log(error);
            });
    }
}
