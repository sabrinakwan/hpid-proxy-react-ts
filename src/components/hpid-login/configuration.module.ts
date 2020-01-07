export enum WorkflowStack {
  Local,
  Dev,
  Staging,
  Production
}

export class ConfigurationModule { 
  private _stack: WorkflowStack = WorkflowStack.Local;
  private _proxyUrl: string = "";
  private _cookieName: string = "";
  private _proxyCookieName: string = "";
  private _livepaperapiUrl: string = "";

  get stack() {
    if (this._stack == null) {
      if (window.location.href.indexOf("-local") > 0) 
        this._stack = WorkflowStack.Local;
      else if (window.location.href.indexOf("-dev") > 0 || window.location.href.indexOf("dev-") > 0 || window.location.href.indexOf("dev.") > 0)
        this._stack = WorkflowStack.Dev;
      else if (window.location.href.indexOf("-staging") > 0 || window.location.href.indexOf("stage-") > 0 || window.location.href.indexOf("stage.") > 0)
        this._stack = WorkflowStack.Staging;
      else
        this._stack = WorkflowStack.Production;
    }
    return this._stack;
  }

  get proxyUrl(): string {
    if (this._proxyUrl == null) {
      const thisStack = this.stack; // call the function to make sure that it initialzes properly
      if (thisStack == WorkflowStack.Local) 
        // you can also point to the local host https://mylinks-local.linkcreationstudio.com:3131
        this._proxyUrl = "https://mylinks-staging.linkcreationstudio.com";
      else if (thisStack == WorkflowStack.Dev || thisStack == WorkflowStack.Staging)
        this._proxyUrl = "https://mylinks-staging.linkcreationstudio.com";
      else
        this._proxyUrl = "https://mylinks.linkcreationstudio.com";
    }
    return this._proxyUrl;
  }

  get cookieName(): string {
    if (this._cookieName == null) {
      const thisStack = this.stack;
      if (thisStack == WorkflowStack.Local || thisStack == WorkflowStack.Dev || thisStack == WorkflowStack.Staging)
        this._cookieName = 'HPREVEAL_STAGE';
      else 
        this._cookieName = 'HPREVEAL'; 
    }
    return this._cookieName;
  }

  get proxyCookieName(): string {
    if (this._proxyCookieName == null) {
      const thisStack = this.stack;
      if (thisStack == WorkflowStack.Local || thisStack == WorkflowStack.Dev || thisStack == WorkflowStack.Staging)
        this._proxyCookieName = 'HPREVEAL_PROXY_STAGE';
      else 
        this._proxyCookieName = 'HPREVEAL_PROXY';      
    }
    return this._proxyCookieName;
  }

  get livepaperapiUrl(): string {
    if (this._livepaperapiUrl == null) {
      const thisStack = this.stack;
      if (thisStack == WorkflowStack.Local || thisStack == WorkflowStack.Dev || thisStack == WorkflowStack.Staging)
        this._livepaperapiUrl = 'https://stage.livepaperapi.com/';
      else
        this._livepaperapiUrl = 'https://www.livepaperapi.com/';;      
    }
    return this._livepaperapiUrl;
  }
}