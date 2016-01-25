import AppDispatcher from "../AppDispatcher";
import {ActionTypes} from "../Constants";
import {EventEmitter} from "events";

let _links = [];

class LinkStore extends EventEmitter {
	constructor(props) {
		super(props);

		AppDispatcher.register(action => {
			switch(action.actionType) {
				case ActionTypes.RECEIVE_LINKS:
					console.log("3. In store");
					_links = action.links;
					this.emit("change");
					break;
				default:
					//Do nothing
			}
		});
	}
}

export default new LinkStore();