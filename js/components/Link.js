import React from "react";
import Relay from "react-relay";
import moment from 'moment';

class Link extends React.Component {
  dateStyle =() => ({
  	color: '#888',
  	fontSize: '0.7em',
  	marginRight: '0.5em'
  });
  datelabel = () => moment(this.props.link.createdAt).format('L');
  render() {
  	let {link} = this.props;
    return (
		<li>
			<span style={this.dateStyle()}>
			{this.datelabel()}
			</span>
			<a href={link.url} target="_blank">{link.title}</a>
		</li>
    );
  }
}

Link = Relay.createContainer(Link, {
	fragments: {
		link: () => Relay.QL`
		fragment on Link {
			url,
			title,
			createdAt
		}
		`
	}
})

export default Link;