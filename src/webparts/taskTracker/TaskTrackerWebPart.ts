import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import TaskTracker from './TaskTracker';
import { ITaskTrackerProps } from './ITaskTrackerProps';
import { sp } from '@pnp/sp';
import 'react-toastify/dist/ReactToastify.css';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "../../assets/styles/reset.css";

import dayjs from 'dayjs';
import 'dayjs/locale/ar'; // If you need Arabic locale
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';

// Initialize dayjs plugins
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
// Set Arabic locale if needed
dayjs.locale('ar');

export interface ITaskTrackerWebPartProps {
  description: string;
}

export default class TaskTrackerWebPart extends BaseClientSideWebPart<ITaskTrackerWebPartProps> {
  private _isDarkTheme: boolean = false;
  private siteTheme: any = null;

  public async onInit(): Promise<void> {
    await super.onInit();
    sp.setup({
      spfxContext: this.context as any
    });
  }

  public render(): void {
    const element: React.ReactElement<ITaskTrackerProps> = React.createElement(
      TaskTracker,
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
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;

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
