const sinon = require('sinon');
const Tooltip = require('../src/tooltip');
const assert = require('assert');

describe('Tooltip', function () {

    let el;

    beforeEach(function () {
        el = document.createElement('div');
        el.className = 'container';
        el.innerHTML = '<span class="ui-tooltip-trigger"></span><div class="ui-tooltip-panel"></div>';
    });

    it('should show and hide programmatically', function() {
        const activeClass = 'ui-tooltip-active';
        const tooltip = new Tooltip({el: el, activeClass: activeClass});
        assert.ok(!el.classList.contains(activeClass), 'tooltip active class does not exist initially');
        assert.ok(!tooltip.isActive(), 'isActive() is falsy');
        tooltip.show();
        assert.ok(el.classList.contains(activeClass), 'tooltip active class was added when calling show method');
        assert.ok(tooltip.isActive(), 'isActive() is truthy');
        tooltip.hide();
        assert.ok(!el.classList.contains(activeClass), 'tooltip active class was removed when calling hide method');
        assert.ok(!tooltip.isActive(), 'isActive() is falsy');
        tooltip.destroy();
    });

    it('should show and hide when trigger is clicked', function() {
        const showSpy = sinon.spy(Tooltip.prototype, 'show');
        let showCallCount = 0;
        const hideSpy = sinon.spy(Tooltip.prototype, 'hide');
        let hideCallCount = 0;
        const triggerClass = 'ui-tooltip-trigger';
        const tooltip = new Tooltip({el: el, showEvent: 'click', hideEvent: 'click', triggerClass: triggerClass});
        const trigger = el.getElementsByClassName(triggerClass)[0];
        const panel = el.getElementsByClassName('ui-tooltip-panel')[0];
        assert.equal(showSpy.callCount, showCallCount, 'show method was NOT fired on init');
        assert.equal(hideSpy.callCount, hideCallCount, 'hide method was NOT fired on init');

        trigger.click();
        showCallCount++;
        assert.equal(showSpy.callCount, showCallCount, 'show method was fired after first click on trigger');
        assert.equal(hideSpy.callCount, hideCallCount, 'hide method was NOT called');
        trigger.click();
        hideCallCount++;
        assert.equal(hideSpy.callCount, hideCallCount, 'hide method was fired after second click on trigger');
        assert.equal(showSpy.callCount, showCallCount, 'show method was NOT called');
        tooltip.destroy();
        trigger.click();
        assert.equal(hideSpy.callCount, hideCallCount, 'hide method was NOT fired after destroy');
        assert.equal(showSpy.callCount, showCallCount, 'show method was NOT fired');
        showSpy.restore();
        hideSpy.restore();
    });

    it('should NOT show and hide when no event options are specified', function() {
        const showSpy = sinon.spy(Tooltip.prototype, 'show');
        const hideSpy = sinon.spy(Tooltip.prototype, 'hide');
        const triggerClass = 'ui-tooltip-trigger';
        const tooltip = new Tooltip({el: el, triggerClass: triggerClass});
        const trigger = el.getElementsByClassName(triggerClass)[0];
        trigger.click();
        assert.equal(showSpy.callCount, 0, 'show method was NOT fired after click on trigger because no event was specified in init option');
        assert.equal(hideSpy.callCount, 0, 'hide method was NOT called');
        tooltip.destroy();
        showSpy.restore();
        hideSpy.restore();
    });

    it('should fire callback functions when showing and hiding', function() {
        const onShowSpy = sinon.spy();
        const onHideSpy = sinon.spy();
        const tooltip = new Tooltip({el: el, onShow: onShowSpy, onHide: onHideSpy});
        tooltip.show();
        assert.equal(onShowSpy.callCount, 1, 'onShow callback is fired when tooltip shows');
        tooltip.hide();
        assert.equal(onHideSpy.callCount, 1, 'onHide callback is fired when tooltip hides');
        tooltip.destroy();
    });

    it('should show and hide on hover', function() {
        const showSpy = sinon.spy(Tooltip.prototype, 'show');
        let showCallCount = 0;
        const hideSpy = sinon.spy(Tooltip.prototype, 'hide');
        let hideCallCount = 0;
        const triggerClass = 'ui-tooltip-trigger';
        const tooltip = new Tooltip({
            el: el,
            showEvent: 'mouseenter',
            hideEvent: 'mouseleave',
            triggerClass: triggerClass
        });
        const trigger = el.getElementsByClassName(triggerClass)[0];
        assert.equal(showSpy.callCount, showCallCount, 'show method was NOT fired on init');
        assert.equal(hideSpy.callCount, hideCallCount, 'hide method was NOT fired on init');
        let evt = document.createEvent('MouseEvents');
        evt.initEvent('mouseenter', true, true);
        trigger.dispatchEvent(evt);
        showCallCount++;
        assert.equal(showSpy.callCount, showCallCount, 'show method was fired after hovering on trigger');
        assert.equal(hideSpy.callCount, hideCallCount, 'hide method was NOT called');
        evt = document.createEvent('MouseEvents');
        evt.initEvent('mouseleave', true, true);
        trigger.dispatchEvent(evt);
        hideCallCount++;
        assert.equal(hideSpy.callCount, hideCallCount, 'hide method was fired after mouse stops hovering trigger');
        assert.equal(showSpy.callCount, showCallCount, 'show method was NOT called');
        tooltip.destroy();
        showSpy.restore();
        hideSpy.restore();
    });

    it('should return promise result from waitForElementTransition when calling show()', function(done) {
        const tooltip = new Tooltip({el: el});
        tooltip.show().then(() => {
            assert.ok(true);
            tooltip.destroy();
            done();
        });
    });

    it('should return promise result from waitForElementTransition when calling hide()', function(done) {
        const tooltip = new Tooltip({el: el});
        tooltip.hide().then(() => {
            assert.ok(true);
            tooltip.destroy();
            done();
        });
    });


    it('should remove active class after showing when calling destroy()', function(done) {
        const activeClass = 'my-class';
        const tooltip = new Tooltip({
            el,
            activeClass
        });
        tooltip.show().then(() => {
            assert.ok(el.classList.contains(activeClass));
            tooltip.destroy();
            assert.ok(!el.classList.contains(activeClass));
            done();
        });
    });

});
