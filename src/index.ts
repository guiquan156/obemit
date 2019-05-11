interface IData {
  [props: string]: any;
}

interface ICallback {
  __cbs__: Array<() => any>;
  [props: string]: any;
}

export default class Event {
  [data: string]: any;
  callback: ICallback = {
    __cbs__: [],
  };

  constructor(data: IData = {}) {
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        this[key] = data[key];
      }
    }
  }

  emit(name: string = '') {
    let curr: ICallback | false = this.getCallback(name);
    let walk = (cbObj: ICallback) => {
      // console.log(cbObj)
      if (cbObj.__cbs__) {
        cbObj.__cbs__.forEach(cb => cb())
      }
      for (let k in cbObj) {
        if (cbObj.hasOwnProperty(k)) {
          walk(cbObj[k])
        }
      }
    };

    if (!curr) return
    walk(curr)
  }

  on(name: string | (() => any), func: () => any = () => {}) {
    if (typeof name == 'function') {
      func = name;
      name = '';
    }
    let curr: ICallback = <ICallback>this.getCallback(name, true);
    curr.__cbs__.push(func);
  }

  off(name: string = '') {
    let nameList = name.split('.');
    let currName = nameList.pop();
    let prev = this.getCallback(nameList.join('.')) || this.callback;

    if (!currName) {
      this.callback = {
        __cbs__: [],
      };
      return;
    }
    prev[currName] = {
      __cbs__: [],
    };
  }

  getCallback(name: string = '', create: boolean = false): ICallback | false {
    let nameList: Array<string> = name === '' ? [] : name.split('.');
    let curr = this.callback;

    for (let i = 0; i < nameList.length; i++) {
      let currName = nameList[i];
      if (!curr[currName]) {
        if (create) {
          curr[currName] = {
            __cbs__: [],
          };
        } else {
          return false;
        }
      }
      curr = curr[currName];
    }
    return curr;
  }
}
