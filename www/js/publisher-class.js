export class Publisher {
    subscibers = [];

    subscribe(subscriber) {
        this.subscibers.push(subscriber);
    }

    unsubscribe(subscriber) {
        this.subscibers = this.subscibers.filter(function(value, index, arr){ 
            return !(subscriber === value);
        });
    }

    notify(msg) {
        this.subscibers.forEach(subsciber => {
            subsciber.update(msg);
        });
    }
}
  