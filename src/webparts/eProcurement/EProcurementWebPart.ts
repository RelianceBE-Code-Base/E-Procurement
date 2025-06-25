import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'EProcurementWebPartStrings';
//import EProcurement from './components/EProcurement';
import { IEProcurementProps } from './components/IEProcurementProps';
//import App from './components/App'
//import '../../index.css'
import EProcurement from './components/EProcurement';

export interface IEProcurementWebPartProps {
  description: string;
}

export default class EProcurementWebPart extends BaseClientSideWebPart<IEProcurementWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {
    const element: React.ReactElement<IEProcurementProps> = React.createElement(
      EProcurement,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {

    // Ensure Default Chrome Is Disabled
    this._ensureDefaultChromeIsDisabled();

    // Add Tailwind CSS if not already added
    if (!document.querySelector('#tailwind-css')) {
      const link = document.createElement('link');
      link.id = 'tailwind-css';
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css';
      document.head.appendChild(link);
    }

    return this._getEnvironmentMessage().then(message => {
      this._environmentMessage = message;
    });
  }



  private _getEnvironmentMessage(): Promise<string> {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams, office.com or Outlook
      return this.context.sdks.microsoftTeams.teamsJs.app.getContext()
        .then(context => {
          let environmentMessage: string = '';
          switch (context.app.host.name) {
            case 'Office': // running in Office
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOffice : strings.AppOfficeEnvironment;
              break;
            case 'Outlook': // running in Outlook
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOutlook : strings.AppOutlookEnvironment;
              break;
            case 'Teams': // running in Teams
            case 'TeamsModern':
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
              break;
            default:
              environmentMessage = strings.UnknownEnvironment;
          }

          return environmentMessage;
        });
    }

    return Promise.resolve(this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment);
  }

  private _ensureDefaultChromeIsDisabled(): void {
    const elements = ['#workbenchPageContent', '#SuiteNavWrapper', '.SPCanvas-canvas', '.CanvasZone', '.ms-CommandBar', '#spSiteHeader', '.commandBarWrapper'];
    elements.forEach(selector => {
      document.querySelectorAll(selector).forEach(element => {
        (element as HTMLElement).style.display = 'none !important';
        (element as HTMLElement).style.maxWidth = 'none';
      });
    });

    // Check if the device is mobile and apply mobile-specific styles
    if (this._isMobileDevice()) {
      const mobileElements = [
        '.spMobileHeader',
        '.ms-FocusZone',
        '.ms-CommandBar',
        '.spMobileNav',
        '#O365_MainLink_NavContainer', // Waffle (App Launcher)
        '.ms-Nav', // Additional possible mobile navigation elements
        '.ms-Nav-item' // Possible item within the navigation
      ];
      mobileElements.forEach(selector => {
        document.querySelectorAll(selector).forEach(element => {
          (element as HTMLElement).style.display = 'none';
        });
      });
    }
  }

  private _isMobileDevice(): boolean {
    // Check if the user is on a mobile device based on user agent or screen width
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /iphone|ipod|ipad|android|blackberry|windows phone/i.test(userAgent);
    return isMobile || window.innerWidth <= 768; // Custom breakpoint for mobile
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

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
