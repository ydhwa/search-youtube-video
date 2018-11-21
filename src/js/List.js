import React, { Component } from 'react';
import '../css/App.css';

class List extends Component {
    render() {
        const videos = this.props.videos;

        if(videos !== []) {
            var listItems = videos.map((video) =>
            <li className="item">
      		    <a href={ 'http://www.youtube.com/watch?v=' + video.id.videoId } target="_blank">
      			<div className="image-wrapper">
      			    <img src={ video.snippet.thumbnails.high.url }/>
      			</div>
      			<h3>{ video.snippet.title }</h3>
                <div className="description">
      				<small>By <span className="channel-title">{ video.snippet.channelTitle }</span> on <time>{ video.snippet.publishedAt }</time></small>
      				<p>{ video.snippet.description }</p>
      			</div>
      			</a>
      		</li>, document.getElementById("results"));
        }

        return (<div>{ listItems }</div>);
    }
}

export default List;
