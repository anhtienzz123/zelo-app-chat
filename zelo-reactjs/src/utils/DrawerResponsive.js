export default function renderWidthDrawer(width) {
    // min-width: 992px) and (max-width: 1199px
    if (width > 1199) {
        return 30;
    }
    if (width >= 992 && width <= 1199) {
        return 40;
    }
    if (width >= 768 && width <= 991) {
        return 60;
    }
    if (width >= 577 && width <= 767) {
        return 70;
    }
    if (width <= 576) {
        return 80;
    }
}
