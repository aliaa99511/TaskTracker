import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import TasksTracker from './components/TasksTracker';
import { ITasksTrackerProps } from './components/ITasksTrackerProps';
import { sp } from '@pnp/sp';
import 'react-toastify/dist/ReactToastify.css';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "../../assets/styles/reset.css";
import dayjs from 'dayjs';
import 'dayjs/locale/ar';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import "../tasksTracker/components/TasksTracker.module.scss"

// Initialize dayjs plugins
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.locale('ar');


export interface ITasksTrackerWebPartProps {
  description: string;
}

export default class TasksTrackerWebPart extends BaseClientSideWebPart<ITasksTrackerWebPartProps> {
  private _isDarkTheme: boolean = false;
  private siteTheme: any = null;

  public async onInit(): Promise<void> {
    await super.onInit();
    sp.setup({
      spfxContext: this.context as any
    });
  }

  public render(): void {
    console.log('pageContext', this.context.pageContext);
    const element: React.ReactElement<ITasksTrackerProps> = React.createElement(
      TasksTracker,
      {
        siteURL: this.context.pageContext.web.absoluteUrl,
        user: this.context.pageContext.user,
        isDarkTheme: this._isDarkTheme,
        siteTheme: this.siteTheme,
        loginName: this.context.pageContext.user.loginName,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) return;

    this._isDarkTheme = !!currentTheme.isInverted;
    this.siteTheme = currentTheme;

    const { semanticColors } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
}
