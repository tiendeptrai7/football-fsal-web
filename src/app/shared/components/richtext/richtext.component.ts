/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AfterViewInit,
  Component,
  forwardRef,
  Input,
  ViewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NgForm,
} from '@angular/forms';
import { uuid } from '@utils/string';
import { NzMessageService } from 'ng-zorro-antd/message';

import { AzureStorageService } from '../../services/azure-storage.service';

declare let $: any;

@Component({
  selector: 'richtext',
  templateUrl: 'richtext.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichTextComponent),
      multi: true,
    },
  ],
})
export class RichTextComponent implements ControlValueAccessor, AfterViewInit {
  @ViewChild('formInsertImage') formInsertImage!: NgForm;
  @ViewChild('formInsertLink') formInsertLink!: NgForm;

  @Input() isComplex = true;

  id!: string;
  isDisabled = false;

  visibleInsertImage = false;
  visibleInsertLink = false;
  visibleInsertVideo = false;
  linkVideo?: string;
  vmLink: {
    isLink?: boolean;
    link?: boolean;
    file?: File;
    text?: string;
    toolTip?: string;
    isNewTab?: boolean;
  } = {};
  vmImage: {
    isLink?: boolean;
    link?: string;
    alt?: string;
    file?: File;
  } = {};

  valueWidth = '100%';
  valueHeight = '720px';

  private isInitEditor = false;

  private _content: string = '';

  onChange!: (value?: string) => void;
  onTouched!: () => void;

  get editorId() {
    return `editor-${this.id}`;
  }

  get $editor(): any {
    return $(`#${this.editorId}`);
  }

  get editor(): kendo.ui.Editor {
    return this.$editor.data('kendoEditor');
  }

  @Input()
  height?: number;

  @Input()
  showFontSize = true;

  get heightValue(): string {
    if (this.height) {
      return `${this.height}px`;
    }
    return '500px';
  }

  get value(): string | undefined {
    return this._content;
  }

  set value(value: string | undefined) {
    if (this._content !== value) {
      this._content = value || '';
      this.onChange(value || '');
    }
  }

  get tools(): kendo.ui.EditorTool[] | string[] | undefined {
    const tools = [
      { name: 'formatting' },
      { name: 'cleanFormatting' },
      { name: 'copyFormat' },
      { name: 'applyFormat' },
      { name: 'undo' },
      { name: 'redo' },
      { name: 'bold' },
      { name: 'italic' },
      { name: 'underline' },
      { name: 'strikethrough' },
      { name: 'justifyLeft' },
      { name: 'justifyCenter' },
      { name: 'justifyRight' },
      { name: 'justifyFull' },
      { name: 'insertUnorderedList' },
      { name: 'insertOrderedList' },
      { name: 'insertUpperRomanList' },
      { name: 'insertLowerRomanList' },
      { name: 'indent' },
      { name: 'outdent' },
      ...(this.isComplex
        ? [
            {
              name: 'createLink',
              exec: (e: Event) => {
                e.preventDefault();
                e.stopPropagation();
                this.customInsertLink();
              },
            },
            { name: 'unlink' },
            {
              name: 'insertImage',
              exec: (e: Event) => {
                e.preventDefault();
                e.stopPropagation();
                this.customImageUpload();
              },
            },
            {
              tooltip: 'insert video',
              name: 'fileVideo',
              exec: () => {
                this.visibleInsertVideo = true;
                this.linkVideo = '';
              },
            },
          ]
        : []),
      { name: 'subscript' },
      { name: 'superscript' },
      { name: 'tableWizard' },
      ...(this.isComplex ? [{ name: 'createTable' }] : []),
      { name: 'addRowAbove' },
      { name: 'addRowBelow' },
      { name: 'addColumnLeft' },
      { name: 'addColumnRight' },
      { name: 'deleteRow' },
      { name: 'deleteColumn' },
      { name: 'mergeCellsHorizontally' },
      { name: 'mergeCellsVertically' },
      { name: 'splitCellHorizontally' },
      { name: 'splitCellVertically' },
      { name: 'tableAlignLeft' },
      { name: 'tableAlignCenter' },
      { name: 'tableAlignRight' },
      {
        name: 'fontName',
      },
      {
        name: 'fontSize',
        items: [
          { text: ' 8pt', value: '0.5rem' },
          { text: '10pt', value: '0.625rem' },
          { text: '12pt', value: '0.75rem' },
          { text: '14pt', value: '0.875rem' },
          { text: '16pt', value: '1rem' },
          { text: '18pt', value: '1.125rem' },
          { text: '20pt', value: '1.25rem' },
          { text: '22pt', value: '1.375rem' },
          { text: '24pt', value: '1.5rem' },
          { text: '26pt', value: '1.625rem' },
          { text: '28pt', value: '1.75rem' },
          { text: '30pt', value: '1.875rem' },
          { text: '32pt', value: '2rem' },
        ],
      },
      {
        name: 'foreColor',
        template: "<div  class='fore-ground-picker picker'></div>",
      },
      {
        name: 'backColor',
        template: "<div class='back-ground-picker picker'></div>",
      },
      ...(this.isComplex ? [{ name: 'viewHtml' }] : []),
    ];

    if (!this.showFontSize) {
      const index = tools.findIndex(e => e.name == 'fontSize');
      tools.splice(index, 1);
    }

    return tools;
  }

  constructor(
    private readonly azureStorageService: AzureStorageService,
    private readonly messageService: NzMessageService
  ) {
    this.id = uuid();
  }

  ngAfterViewInit(): void {
    this.initEditor();
  }

  private initEditor() {
    if (this.isDisabled) {
      return;
    }

    if (this.isInitEditor) {
      if (this.editor) this.editor.value(this._content);
      return;
    }

    if (this.$editor.length === 0) {
      return;
    }

    this.isInitEditor = true;

    setTimeout(() => {
      this.$editor.kendoEditor({
        stylesheets: ['/editor-styles.css'],
        resizable: {
          content: true,
        },
        tools: this.tools,
        change: () => {
          this.value = this.editor?.value();
        },
        keyup: () => {
          this.value = this.editor?.value();
        },
        select: () => {
          this.value = this.editor?.value();
        },
      });

      const cbFontName = $('select.k-fontName').data('kendoComboBox');
      if (cbFontName) {
        cbFontName.setOptions({
          template: `<span style='font-weight:500; font-family: #: value #'>#: text #</span>`,
        });

        const cbFontSize = $('select.k-fontSize').data('kendoComboBox');
        cbFontSize?.input?.attr('readonly', 'readonly');

        cbFontName?.input?.attr('readonly', 'readonly');

        $('.fore-ground-picker.picker').kendoColorPicker({
          views: ['gradient'],
          view: 'gradient',
          format: 'hex',
          buttons: true,
          formats: ['rgb', 'hex'],
          input: true,
          palette: null,
          change: (e: any) => {
            this.editor.exec('foreColor', { value: e?.value });
          },
        });

        $('.back-ground-picker.picker').kendoColorPicker({
          views: ['gradient'],
          view: 'gradient',
          format: 'hex',
          buttons: true,
          formats: ['rgb', 'hex'],
          input: true,
          palette: null,
          change: (e: any) => {
            this.editor.exec('backColor', { value: e?.value });
          },
        });
      }

      this.editor?.value(this._content);
    }, 500);
  }

  registerOnChange(fn: (value?: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  writeValue(value: string): void {
    if (value) {
      this._content = value;
    } else {
      this._content = '';
    }
  }

  typeImageChange() {
    this.vmImage.file = undefined;
    this.vmImage.link = undefined;
  }

  fileImageSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.vmImage.file = event.target.files[0];
    }
  }

  typeLinkChange() {
    this.vmLink.file = undefined;
    this.vmLink.link = undefined;
  }

  fileLinkSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.vmLink.file = event.target.files[0];
    }
  }

  insertLink() {
    if (!this.formInsertLink.valid) return;
    if (this.vmLink.isLink) {
      this.visibleInsertLink = false;
      this.editor.exec('insertHtml', {
        value: `<a href="${this.vmLink.link}" title="${this.vmLink.toolTip || ''}"${
          this.vmLink.isNewTab ? ' target="_blank"' : ''
        }">${this.vmLink.text}</a>`,
      });
      return;
    }

    if (!this.vmLink.file) {
      this.visibleInsertLink = false;
      return;
    }
    this.azureStorageService.uploadFileSync(this.vmLink.file).then(fileUrl => {
      this.visibleInsertLink = false;
      const urlFile = this.azureStorageService.getFileUrl(fileUrl);
      this.editor.exec('insertHtml', {
        value: `<a href="${urlFile}" title="${this.vmLink.toolTip || ''}"${
          this.vmLink.isNewTab ? ' target="_blank"' : ''
        }">${this.vmLink.text}</a>`,
      });
    });
  }

  insertImage() {
    if (!this.formInsertImage.valid) return;

    if (this.vmImage.isLink) {
      this.editor.exec('insertHtml', {
        value: `<img src="${this.vmImage.link}" alt="${this.vmImage.alt || ''}">`,
      });

      this.visibleInsertImage = false;
      return;
    }

    if (!this.vmImage.file) {
      this.visibleInsertImage = false;
      return;
    }
    this.azureStorageService.uploadFileSync(this.vmImage.file).then(fileUrl => {
      const urlFile = this.azureStorageService.getFileUrl(fileUrl);
      this.editor.exec('insertHtml', {
        value: `<img src="${urlFile}" alt="${this.vmImage.alt}">`,
      });
      this.visibleInsertImage = false;
    });
  }

  insertVideo() {
    if (!this.linkVideo) {
      this.messageService.error('Please enter a video link');
      return;
    }
    try {
      const url = new URL(this.linkVideo);
      const domains = [
        'www.youtube.com',
        'youtube.com',
        'youtu.be',
        'player.vimeo.com',
        'vimeo.com',
      ];
      const index = domains.indexOf(url.hostname.toLowerCase());
      if (index === -1) {
        this.messageService.error(
          'Only YouTube or Vimeo video links are accepted'
        );
        return;
      }
      // Validate width
      if (!this.valueWidth) {
        this.messageService.error('Please enter the width');
        return;
      }
      if (!this.valueHeight) {
        this.messageService.error('Please enter the height');
        return;
      }
      if (
        !/^(\d|[1-9]\d|100)?%/.test(this.valueWidth) &&
        !/^([1-9]\d+?px)|([1-9]px)/.test(this.valueWidth)
      ) {
        this.messageService.error('Width is not in the correct format');
        return;
      }
      if (
        !/^(\d|[1-9]\d|100)?%/.test(this.valueHeight) &&
        !/^([1-9]\d+?px)|([1-9]px)/.test(this.valueHeight)
      ) {
        this.messageService.error('Height is not in the correct format');
        return;
      }

      let id = '';
      if (index < 2) {
        id = url.searchParams.get('v') || '';
      } else if (index === 2 || index === 4) {
        id = url.pathname.substring(1);
      } else if (index === 3) {
        id = url.pathname.substring(7);
      }

      if (!id) {
        this.messageService.error(
          'Only YouTube or Vimeo video links are accepted'
        );
        return;
      }

      let embed = `<iframe width="${this.valueWidth}" height="${this.valueHeight}" src="https://www.youtube.com/embed/${id}" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe><br>`;
      if (index > 2) {
        embed = `<iframe src="https://player.vimeo.com/video/${id}?h=0a14e377a8" width="${this.valueWidth}" height="${this.valueHeight}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe><br>`;
      }

      this.editor.exec('insertHtml', {
        value: embed,
      });

      this.visibleInsertVideo = false;
    } catch {
      this.messageService.error('Invalid video link format');
      this.visibleInsertVideo = false;
    }
  }

  private customInsertLink() {
    this.vmLink = { isLink: true };
    this.visibleInsertLink = true;
  }

  private customImageUpload() {
    this.vmImage = { isLink: true };
    this.visibleInsertImage = true;
  }
}
