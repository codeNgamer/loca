import $ from 'jquery';
import moment from 'moment';
import i18next from 'i18next';
import Form from '../../lib/form';

class ContractDocumentsForm extends Form {
    constructor() {
        super({
            alertOnFieldError: true
        });
    }

    // METHODS TO OVERRIDE
    getDomSelector() {
        return '#contract-documents-form';
    }

    // No add possibility
    // getAddUrl() {
    //     return '/documents/add';
    // };

    getUpdateUrl() {
        return '/api/documents';
    }

    getDefaultData() {
        return {
            _id: '',
            occupantId: '',
            documents: [{name:'', expirationDate:''}]
        };
    }

    getManifest() {
        return {
            'name_0': {
                minlength: 2
            },
            'expirationDate_0': {
                required: {
                    depends: () => $(this.getDomSelector() + ' #name_0').val().trim() !== ''
                },
                fdate: [i18next.t('__fmt_date__')]
            }
        };
    }

    beforeSetData(args) {
        const occupant = args[0];

        this.documentRowCount=0;

        if (occupant.documents) {
            occupant.documents.forEach((doc, index) => {
                if (doc.expirationDate) {
                    doc.expirationDate = moment(doc.expirationDate).format(i18next.t('__fmt_date__')); //db formtat to display one
                }
                if (index !==0) { // Except first one row still exists
                    this.addDocumentRow();
                }
            });
        }
    }

    afterSetData(args) {
        const occupant = args[0];

        $(this.getDomSelector() + ' #occupantNameLabel').html(i18next.t('\'s documents', {name:occupant.name}));
    }

    onGetData(data) {
        if (data.documents) {
            data.documents.forEach((doc) => {
                if (doc.expirationDate) {
                    doc.expirationDate = moment(doc.expirationDate, i18next.t('__fmt_date__')).toDate(); //display format to db one
                }
            });
        }
        return data;
    }

    onBind() {
        // Dynamic property rows
        $(this.getDomSelector() + ' #btn-add-document').click(() => {
            this.addDocumentRow();
            return false;
        });

        // Remove dynamic rows
        const that = this;
        $(this.getDomSelector() + ' .form-btn-remove-row').click(function() {
            const $row = $(this).parents('.form-row');
            if (!$row.hasClass('master-form-row')) {
                $row.remove();
            }
            else {
                $(that.getDomSelector() + ' #name_0').val('');
                $(that.getDomSelector() + ' #expirationDate_0').val('');
            }
            return false;
        });

        // TODO: Put this in css
        //$(this.getDomSelector() + ' .master-form-row .form-btn-remove-row').hide();
    }

    addDocumentRow() {
        // Create new property row
        this.documentRowCount++;
        const $newRow = $(this.getDomSelector() + ' #documents .master-form-row').clone(true).removeClass('master-form-row');
        $('.has-error', $newRow).removeClass('has-error');
        $('label.error', $newRow).remove();
        const itemDocumentName = 'name_'+this.documentRowCount;
        const itemExpirtationDateName = 'expirationDate_'+this.documentRowCount;
        $('#name_0',$newRow).attr('id', itemDocumentName).attr('name', itemDocumentName).val('');
        $('#expirationDate_0',$newRow).attr('id', itemExpirtationDateName).attr('name', itemExpirtationDateName).val('');
        $('.form-btn-remove-row',$newRow).show();
        // Add new property row in DOM
        $(this.getDomSelector() + ' #documents').append($newRow);

        //Add jquery validation rules for new added fields
        $('#'+itemDocumentName, $newRow).rules('add', {
            required:true,
            minlength: 2
        });

        $('#'+itemExpirtationDateName, $newRow).rules('add', {
            required: true,
            fdate: [i18next.t('__fmt_date__')]
        });
    }
}

export default ContractDocumentsForm;
