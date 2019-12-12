import { Component, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InputRendererOptions, JsxRenderFunc, ReactWrapperComponent } from '@angular-react/core';
import { IPanelHeaderRenderer, IPanelProps } from 'office-ui-fabric-react/lib/Panel';
import { Message, TextMessage} from '../../../supportbot/models/message';
import { MessageSender, ButtonActionType } from '../../../supportbot/models/message-enums';
import { MessageProcessor } from '../../../supportbot/message-processor.service';
import { DynamicComponent } from '../../../supportbot/dynamic-component/dynamic.component';
import { TextMessageComponent } from '../../../supportbot/common/text-message/text-message.component';
import { PanelType, IPanelStyles } from 'office-ui-fabric-react';
import { GenieChatFlow } from '../../../supportbot/message-flow/v2-flows/genie-chat.flow';
//  import {} from 'office-ui-fabric-core/lib';

//  createInputJsxRenderer, createRenderPropHandler


@Component({
    selector: 'category-overview',
    templateUrl: './category-overview.component.html',
    styleUrls: ['./category-overview.component.scss',
    ]
})
//extends Renderable
export class CategoryOverviewComponent implements OnInit {
    @ViewChild('scrollMe', { static: false }) myScrollContainer: ElementRef;
  //  @ViewChild('ms-Panel-scrollableContent', { static: false }) myScrollContainer: ElementRef;

    messages: Message[] = [];
    showTypingMessage: boolean;
    chatContainerHeight: number;
    categoryId: string = "";
    isOpen: boolean = true;
    // navigationContent: InputRendererOptions<IPanelProps>;
    //  navigationContent: RenderPropContext<IPanelProps>;
    navigationContent: (() => HTMLElement);
    renderFooter: (() => HTMLElement);
    isLightDismiss: boolean = true;
    welcomeMessage: string = "Welcome to App Service Diagnostics. My name is Genie and I am here to help you answer any questions you may have about diagnosing and solving your problems with your app. Please describe the issue of your app.";
    panelStyles: any;
    type: PanelType = PanelType.custom;
    width: string = "1200px";

    // @ViewChild('panelTitle', { static: true }) navigationContentTemplate: TemplateRef<any>;
    // @ViewChild("headerTemplate", { static: true }) headerTemplate: TemplateRef<any>;
    // @ViewChild('tpl', { static: true }) tpl: TemplateRef<any>;

    constructor(private _activatedRoute: ActivatedRoute, private _messageProcessor: MessageProcessor, private _genieChatFlow: GenieChatFlow) {
            this.panelStyles = {
           // type: PanelType.smallFixedNear,
            root: {
                          // position: 'fixed',
                          width: 585,
                          // boxSizing: 'border-box',
                          // overflowY: 'auto',
                          // overflowX: 'hiden',
                      },
         //   customWidth: "585",
        };
        this.chatContainerHeight = 0;
    }

    scrollToBottom(event?: any): void {

        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
            console.log("updating scrolling", this.myScrollContainer);
        } catch (err) { }
    }

    getMessage(event?: any): void {
        const self = this;
        const message = this._messageProcessor.getNextMessage(event);

        if (message) {
            this.messages.push(message);
            if (message.messageDelayInMs >= 2000) {
                this.showTypingMessage = true;

                // To show the typing message icon, we need to scroll the page to the bottom.
                setTimeout(() => {
                  //  this.scrollToBottom();
                }, 200);
            }

            setTimeout(function () {
                self.showTypingMessage = false;
                this.messages.push(message);
                console.log("2nd settimeout");
            }, message.messageDelayInMs);
        }
    }

    onSearchEnter(event: any): void {
        this._genieChatFlow.createMessageFlowForAnaysis(event.newValue).subscribe((analysisMessages: Message[]) => {
            analysisMessages.forEach(message => {
                this.messages.push(message);
            });

            console.log("constructing messages onsearch", this.messages);
        });
  }

    closePanel() {
        this.isOpen = false;
        console.log("isOpen", this.isOpen);
    }
    ngOnInit() {
        this.categoryId = this._activatedRoute.parent.snapshot.params.category;

        this.messages.push(new TextMessage(this.welcomeMessage, MessageSender.System, 200));
        this.chatContainerHeight = window.innerHeight - 170;
        console.log("window height", this.chatContainerHeight);


        document.getElementById('close').onclick = () => {
            this.isOpen = false;
            console.log("this.isOpen", this.isOpen);
        }


        this.renderFooter = () => {
            // let panelTitle =  document.createElement('fab-search-box') as HTMLElement;
            let panelTitle = document.createElement('div') as HTMLElement;
            //  panelTitle.placeholder = 'Type your question';
            // panelTitle.style.left = '25px';
            // panelTitle.style.right = '32px';
            // panelTitle.style.top = '0px';
            // panelTitle.style.height = '27px';
            // panelTitle.style.fontFamily = "Segoe UI";
            // panelTitle.style.fontSize = "18px";
            // panelTitle.style.lineHeight = "24px";
            // panelTitle.style.display = "flex";
            // panelTitle.style.alignItems = "flex-end";
            panelTitle.innerHTML = "Hi my name is Genie";
            return panelTitle;
            // (props?: P, defaultRender?: (props?: P) => JSX.Element | null): JSX.Element | null;
        };



        // this.navigationContent =  {
        //     render: defaultProps => ({
        //       ...defaultProps,
        //       onRenderNavigationContent: (props, defaultRender) => return (
        //         <>
        //     <SearchBox placeholder="Search here..." styles={searchboxStyles} ariaLabel="Sample search box. Does not actually search anything." />
        //     {
        //     ${defaultRender!(props)}
        //   </>)
        //     }),
        //   };

        //     this.navigationContent =   (props, defaultRender) => {
        //         `<>
        //     <SearchBox placeholder="Search here..." styles={searchboxStyles} ariaLabel="Sample search box. Does not actually search anything." />
        //     {// This custom navigation still renders the close button (defaultRender).
        //     // If you don't use defaultRender, be sure to provide some other way to close the panel.
        //     ${defaultRender!(props)}
        //   </>`;
        // };
        console.log("routes", this._activatedRoute.parent);
        console.log("categoryId", this.categoryId);
    }

}
