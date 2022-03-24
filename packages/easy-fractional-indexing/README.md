A convenient wrapper around [fractional-indexing](https://github.com/rocicorp/fractional-indexing/).

## Functions

<dl>
<dt><a href="#generateKeyBetween">generateKeyBetween(a, b, [digits])</a></dt>
<dd></dd>
<dt><a href="#generateKeyBetween">generateKeyBetween(a, b, n, [digits])</a></dt>
<dd></dd>
<dt><a href="#move">move()</a></dt>
<dd><p>Base movement function, use <code>moveUp</code> or <code>moveDown</code> instead.</p>
</dd>
<dt><a href="#moveUp">moveUp([allIndexes], [currentIndex])</a> ⇒ <code>string</code></dt>
<dd><p>Given a list of indices, get a new index for moving current index up one position in the list.</p>
</dd>
<dt><a href="#moveDown">moveDown([allIndexes], [currentIndex])</a> ⇒ <code>string</code></dt>
<dd><p>Given a list of indices, get a new index for moving current index down one position in the list.</p>
</dd>
<dt><a href="#getStartIndex">getStartIndex()</a> ⇒ <code>string</code></dt>
<dd><p>Get the starting index for a new list.</p>
</dd>
</dl>

<a name="generateKeyBetween"></a>

## generateKeyBetween(a, b, [digits])
**Kind**: global function  

| Param | Type |
| --- | --- |
| a | <code>string</code> \| <code>null</code> | 
| b | <code>string</code> \| <code>null</code> | 
| [digits] | <code>string</code> \| <code>undefined</code> | 

<a name="generateKeyBetween"></a>

## generateKeyBetween(a, b, n, [digits])
**Kind**: global function  

| Param | Type |
| --- | --- |
| a | <code>string</code> \| <code>null</code> | 
| b | <code>string</code> \| <code>null</code> | 
| n | <code>number</code> | 
| [digits] | <code>string</code> \| <code>undefined</code> | 

<a name="move"></a>

## move()
Base movement function, use `moveUp` or `moveDown` instead.

**Kind**: global function  
<a name="moveUp"></a>

## moveUp([allIndexes], [currentIndex]) ⇒ <code>string</code>
Given a list of indices, get a new index for moving current index up one position in the list.

**Kind**: global function  

| Param | Type | Default |
| --- | --- | --- |
| [allIndexes] | <code>Array.&lt;string&gt;</code> | <code>[]</code> | 
| [currentIndex] | <code>string</code> | <code>&quot;\&quot;\&quot;&quot;</code> | 

<a name="moveDown"></a>

## moveDown([allIndexes], [currentIndex]) ⇒ <code>string</code>
Given a list of indices, get a new index for moving current index down one position in the list.

**Kind**: global function  

| Param | Type | Default |
| --- | --- | --- |
| [allIndexes] | <code>Array.&lt;string&gt;</code> | <code>[]</code> | 
| [currentIndex] | <code>string</code> | <code>&quot;\&quot;\&quot;&quot;</code> | 

<a name="getStartIndex"></a>

## getStartIndex() ⇒ <code>string</code>
Get the starting index for a new list.

**Kind**: global function  
